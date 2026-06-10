import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TTL_SECONDS,
} from "../utils/jwt";
import { newUuid } from "../utils/uuid";
import { HttpError } from "../utils/response";
import type { JwtAccessPayload } from "../types/jwt.types";

const KST = process.env.KST_IDENTIFIER || "kst_jatikerto";

export interface PublicUser {
  userid: string;          // user_uuid
  username: string;
  name: string;
  roles: Record<string, string[]>;
  pictureUri?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  expDate: number;
  refreshExpDate: number;
  user: PublicUser;
}

const toPublicUser = (row: any): PublicUser => ({
  userid: row.user_uuid,
  username: row.username,
  name: row.nama_lengkap,
  roles: { [KST]: [row.role] },
  pictureUri: row.picture_uri ?? undefined,
});

const buildAccessPayload = (u: PublicUser): JwtAccessPayload => ({
  sub: u.userid,
  username: u.username,
  name: u.name,
  roles: u.roles,
});

export const login = async (
  username: string,
  password: string
): Promise<LoginResult> => {
  const result = await pool.query(
    `SELECT user_id, user_uuid, username, password, nama_lengkap, role, picture_uri
     FROM users WHERE username = $1`,
    [username]
  );

  if (result.rowCount === 0) {
    throw new HttpError(401, "Username atau password salah");
  }
  const row = result.rows[0];

  // Reject placeholder password (admin row freshly created without seed)
  if (row.password === "PLACEHOLDER_HASH") {
    throw new HttpError(
      401,
      "Akun belum dikonfigurasi. Jalankan `npm run db:seed` terlebih dahulu."
    );
  }

  const valid = await bcrypt.compare(password, row.password);
  if (!valid) {
    throw new HttpError(401, "Username atau password salah");
  }

  const user = toPublicUser(row);
  const { token: accessToken, expDate } = signAccessToken(buildAccessPayload(user));

  const jti = newUuid();
  const refreshToken = signRefreshToken({ sub: user.userid, jti });

  // Persist refresh token jti for revocation on logout
  const refreshExpDate = Math.floor(Date.now() / 1000) + REFRESH_TTL_SECONDS;
  await pool.query(
    `INSERT INTO refresh_tokens (jti, user_id, expires_at)
     VALUES ($1, $2, to_timestamp($3))`,
    [jti, row.user_id, refreshExpDate]
  );

  return {
    accessToken,
    refreshToken,
    expDate,
    refreshExpDate,
    user,
  };
};

export const refresh = async (
  refreshToken: string
): Promise<LoginResult> => {
  let payload: { sub: string; jti: string };
  try {
    const decoded = verifyRefreshToken(refreshToken);
    payload = { sub: decoded.sub, jti: decoded.jti };
  } catch {
    throw new HttpError(401, "Refresh token tidak valid atau sudah kadaluwarsa");
  }

  const tokenRow = await pool.query(
    `SELECT jti, revoked_at, expires_at FROM refresh_tokens WHERE jti = $1`,
    [payload.jti]
  );
  if (tokenRow.rowCount === 0) {
    throw new HttpError(401, "Refresh token tidak dikenali");
  }
  if (tokenRow.rows[0].revoked_at) {
    throw new HttpError(401, "Refresh token sudah dicabut");
  }

  const userRow = await pool.query(
    `SELECT user_id, user_uuid, username, nama_lengkap, role, picture_uri
     FROM users WHERE user_uuid = $1`,
    [payload.sub]
  );
  if (userRow.rowCount === 0) {
    throw new HttpError(401, "User tidak ditemukan");
  }

  const user = toPublicUser(userRow.rows[0]);
  const { token: accessToken, expDate } = signAccessToken(buildAccessPayload(user));

  // Rotate refresh token
  const newJti = newUuid();
  const refreshExpDate = Math.floor(Date.now() / 1000) + REFRESH_TTL_SECONDS;
  const newRefresh = signRefreshToken({ sub: user.userid, jti: newJti });

  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE jti = $1`,
    [payload.jti]
  );
  await pool.query(
    `INSERT INTO refresh_tokens (jti, user_id, expires_at)
     VALUES ($1, $2, to_timestamp($3))`,
    [newJti, userRow.rows[0].user_id, refreshExpDate]
  );

  return {
    accessToken,
    refreshToken: newRefresh,
    expDate,
    refreshExpDate,
    user,
  };
};

export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) throw new HttpError(400, "refresh_token tidak ditemukan");

  let payload: { jti: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new HttpError(401, "Refresh token tidak valid");
  }

  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = NOW()
     WHERE jti = $1 AND revoked_at IS NULL`,
    [payload.jti]
  );
};
