import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import type {
  JwtAccessPayload,
  JwtRefreshPayload,
} from "../types/jwt.types";

const ACCESS_SECRET = process.env.JWT_SECRET || "supersecretkey";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || `${ACCESS_SECRET}-refresh`;

const ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL || 900);   // 15 min
const REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL || 604800); // 7 days

const ISS = "stp-ub-system";
const AUD = "kst-dashboard";

export const ACCESS_TTL_SECONDS = ACCESS_TTL;
export const REFRESH_TTL_SECONDS = REFRESH_TTL;

export const signAccessToken = (
  payload: Omit<JwtAccessPayload, "iss" | "aud" | "iat" | "exp">
): { token: string; expDate: number } => {
  const opts: SignOptions = {
    expiresIn: ACCESS_TTL,
    issuer: ISS,
    audience: AUD,
  };
  const token = jwt.sign(payload, ACCESS_SECRET, opts);
  const decoded = jwt.decode(token) as JwtPayload;
  return { token, expDate: decoded.exp ?? 0 };
};

export const verifyAccessToken = (token: string): JwtAccessPayload => {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer: ISS,
    audience: AUD,
  }) as JwtAccessPayload;
};

export const signRefreshToken = (
  payload: Omit<JwtRefreshPayload, "iat" | "exp">
): string => {
  const opts: SignOptions = { expiresIn: REFRESH_TTL };
  return jwt.sign(payload, REFRESH_SECRET, opts);
};

export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtRefreshPayload;
};
