/**
 * Lightweight fetch wrapper for the backend API.
 * Centralizes base URL, JSON parsing, and contract envelope handling.
 *
 * The backend always returns:
 *   { timestamp, response, error? }
 * — we unwrap `response` (or throw on `error`) so callers get plain data.
 */

const API_BASE =
  (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ??
  "http://localhost:5000/api";

interface Envelope<T> {
  timestamp: string;
  response: T | null;
  error?: { code: number; message: string };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** Bearer token (admin endpoints). */
  token?: string;
  /** Send credentials (refresh-token cookie). */
  withCredentials?: boolean;
  signal?: AbortSignal;
}

const buildUrl = (
  path: string,
  query?: RequestOptions["query"]
): string => {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
};

export async function request<T>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(path, opts.query);
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: opts.withCredentials ? "include" : "same-origin",
    signal: opts.signal,
  });

  if (res.status === 204) return undefined as T;

  const json = (await res.json()) as Envelope<T>;
  if (!res.ok || json.error) {
    const code = json.error?.code ?? res.status;
    const msg = json.error?.message ?? res.statusText ?? "Request failed";
    throw new ApiError(code, msg);
  }
  return json.response as T;
}
