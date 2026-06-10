import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { fail } from "../utils/response";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    fail(res, 401, "Authorization header tidak ditemukan");
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    fail(res, 401, "Access token kosong");
    return;
  }

  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    fail(res, 401, "Access token tidak valid atau sudah kadaluwarsa");
  }
};
