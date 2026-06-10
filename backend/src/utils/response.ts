import type { Response } from "express";
import type { ApiSuccess, ApiError } from "../types/api.types";

const nowIso = (): string => new Date().toISOString();

export const ok = <T>(res: Response, data: T, status = 200): Response => {
  const body: ApiSuccess<T> = { timestamp: nowIso(), response: data };
  return res.status(status).json(body);
};

export const created = <T>(res: Response, data: T): Response => ok(res, data, 201);

export const noContent = (res: Response): Response => res.status(204).send();

export const fail = (
  res: Response,
  code: number,
  message: string
): Response => {
  const body: ApiError = {
    timestamp: nowIso(),
    response: null,
    error: { code, message },
  };
  return res.status(code).json(body);
};

/**
 * Domain error class. Throw inside controllers/services and the
 * global error middleware will translate it into the standard
 * envelope.
 */
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}
