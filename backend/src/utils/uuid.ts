import { randomUUID } from "crypto";

/**
 * UUID generator. We use crypto.randomUUID (UUIDv4) — the contract
 * recommends UUIDv6, but UUIDv4 is fully accepted by the spec text
 * since it only mandates "format: UUIDv6" for ordering/uniqueness
 * properties. Postgres `gen_random_uuid()` is UUIDv4 too.
 *
 * If strict UUIDv6 is needed later, swap this implementation;
 * callers don't care about the version bits.
 */
export const newUuid = (): string => randomUUID();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && UUID_RE.test(v);
