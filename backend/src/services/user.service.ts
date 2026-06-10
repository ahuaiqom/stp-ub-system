import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import { HttpError } from "../utils/response";
import type { PageContainer } from "../types/api.types";
import type { PageQueryParams } from "../utils/pagination";

const KST = process.env.KST_IDENTIFIER || "kst_jatikerto";

export interface PublicUser {
  userid: string;
  username: string;
  name: string;
  roles: Record<string, string[]>;
  pictureUri?: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  name: string;
  roles?: Record<string, string[]>;
  pictureUri?: string;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  name?: string;
  roles?: Record<string, string[]>;
  pictureUri?: string;
}

const toPublic = (row: any): PublicUser => ({
  userid: row.user_uuid,
  username: row.username,
  name: row.nama_lengkap,
  roles: { [KST]: [row.role] },
  pictureUri: row.picture_uri ?? undefined,
});

const pickRole = (roles?: Record<string, string[]>): string => {
  if (!roles) return "viewer";
  const arr = roles[KST];
  if (Array.isArray(arr) && arr.length > 0) return arr[0];
  return "viewer";
};

export const list = async (p: PageQueryParams): Promise<PageContainer<PublicUser>> => {
  const rows = await pool.query(
    `SELECT user_uuid, username, nama_lengkap, role, picture_uri
     FROM users ORDER BY user_id ASC LIMIT $1 OFFSET $2`,
    [p.limit, p.offset]
  );
  const countRes = await pool.query<{ c: string }>(
    `SELECT COUNT(*)::text AS c FROM users`
  );
  const total = parseInt(countRes.rows[0].c, 10);
  return {
    offset: p.offset,
    limit: p.limit,
    hasNext: p.offset + rows.rowCount! < total,
    items: rows.rows.map(toPublic),
  };
};

export const get = async (userid: string): Promise<PublicUser> => {
  const res = await pool.query(
    `SELECT user_uuid, username, nama_lengkap, role, picture_uri
     FROM users WHERE user_uuid = $1`,
    [userid]
  );
  if (res.rowCount === 0) throw new HttpError(404, "User tidak ditemukan");
  return toPublic(res.rows[0]);
};

export const create = async (input: CreateUserInput): Promise<PublicUser> => {
  if (!input.username || !input.password || !input.name) {
    throw new HttpError(400, "username, password, dan name wajib diisi");
  }
  const role = pickRole(input.roles);
  const hash = await bcrypt.hash(input.password, 10);
  try {
    const res = await pool.query(
      `INSERT INTO users (username, password, email, nama_lengkap, role, picture_uri)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING user_uuid, username, nama_lengkap, role, picture_uri`,
      [
        input.username.trim(),
        hash,
        `${input.username.trim()}@kst-jatikerto.local`,
        input.name,
        role,
        input.pictureUri ?? null,
      ]
    );
    return toPublic(res.rows[0]);
  } catch (e: any) {
    if (e?.code === "23505") {
      throw new HttpError(409, "Username sudah dipakai");
    }
    throw e;
  }
};

export const update = async (
  userid: string,
  input: UpdateUserInput
): Promise<PublicUser> => {
  const sets: string[] = [];
  const params: unknown[] = [];
  if (input.username !== undefined) {
    params.push(input.username.trim());
    sets.push(`username = $${params.length}`);
  }
  if (input.password) {
    const hash = await bcrypt.hash(input.password, 10);
    params.push(hash);
    sets.push(`password = $${params.length}`);
  }
  if (input.name !== undefined) {
    params.push(input.name);
    sets.push(`nama_lengkap = $${params.length}`);
  }
  if (input.roles !== undefined) {
    params.push(pickRole(input.roles));
    sets.push(`role = $${params.length}`);
  }
  if (input.pictureUri !== undefined) {
    params.push(input.pictureUri || null);
    sets.push(`picture_uri = $${params.length}`);
  }
  if (sets.length === 0) return get(userid);
  sets.push(`updated_at = NOW()`);
  params.push(userid);
  const res = await pool.query(
    `UPDATE users SET ${sets.join(", ")} WHERE user_uuid = $${params.length}
     RETURNING user_uuid, username, nama_lengkap, role, picture_uri`,
    params
  );
  if (res.rowCount === 0) throw new HttpError(404, "User tidak ditemukan");
  return toPublic(res.rows[0]);
};

export const remove = async (userid: string): Promise<void> => {
  const res = await pool.query(`DELETE FROM users WHERE user_uuid = $1`, [userid]);
  if (res.rowCount === 0) throw new HttpError(404, "User tidak ditemukan");
};
