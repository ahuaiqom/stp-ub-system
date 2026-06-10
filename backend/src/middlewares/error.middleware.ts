import type { Request, Response, NextFunction } from "express";
import { HttpError, fail } from "../utils/response";

export const notFound = (_req: Request, res: Response): void => {
  fail(res, 404, "Endpoint tidak ditemukan");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof HttpError) {
    fail(res, err.status, err.message);
    return;
  }

  if (err instanceof SyntaxError && "body" in (err as object)) {
    fail(res, 400, "JSON body tidak valid");
    return;
  }

  console.error("[unhandled]", err);
  fail(res, 500, "Internal server error");
};
