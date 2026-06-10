import { HttpError } from "../utils/response";

export interface LoginInput {
  username: string;
  password: string;
}

export const validateLoginInput = (body: unknown): LoginInput => {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Body request tidak valid");
  }
  const b = body as Record<string, unknown>;
  if (typeof b.username !== "string" || b.username.trim().length === 0) {
    throw new HttpError(400, "username wajib diisi");
  }
  if (typeof b.password !== "string" || b.password.length === 0) {
    throw new HttpError(400, "password wajib diisi");
  }
  return { username: b.username.trim(), password: b.password };
};
