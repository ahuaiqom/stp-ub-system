/**
 * Pagination + table-query parameter parsing per contract §3 / §2.8.1.
 */
import type { TableQueryParams } from "../types/table.types";

const clampInt = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = typeof v === "string" ? parseInt(v, 10) : (v as number);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
};

export interface PageQueryParams {
  offset: number;
  limit: number;
}

export const parsePageQuery = (q: Record<string, unknown>): PageQueryParams => ({
  offset: clampInt(q.offset, 0, Number.MAX_SAFE_INTEGER, 0),
  limit: clampInt(q.limit, 1, 50, 15),
});

export const parseTableQuery = (
  q: Record<string, unknown>
): TableQueryParams => {
  // search_col may appear multiple times (Express coerces to array)
  const searchColRaw = q.search_col;
  let searchCols: number[] = [];
  if (Array.isArray(searchColRaw)) {
    searchCols = searchColRaw
      .map((v) => parseInt(String(v), 10))
      .filter((v) => Number.isFinite(v));
  } else if (typeof searchColRaw === "string" && searchColRaw.length > 0) {
    const n = parseInt(searchColRaw, 10);
    if (Number.isFinite(n)) searchCols = [n];
  }

  const sortOrderRaw = String(q.sort_order ?? "asc").toLowerCase();
  const sortOrder: "asc" | "desc" =
    sortOrderRaw === "desc" ? "desc" : "asc";

  return {
    offset: clampInt(q.offset, 0, Number.MAX_SAFE_INTEGER, 0),
    limit: clampInt(q.limit, 1, 50, 15),
    search: typeof q.search === "string" ? q.search : "",
    searchCols,
    sortCol: clampInt(q.sort_col, -1, 1000, -1),
    sortOrder,
  };
};
