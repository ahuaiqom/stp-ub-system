/**
 * Aggregate read endpoint per contract §4.2.
 * Looks up each item by `code` (UUIDv6) and dispatches to the
 * corresponding module service. Per-item errors are reported in
 * the item, not the top-level response.
 */
import { Router, type Request, type Response, type NextFunction } from "express";
import { ok, HttpError } from "../utils/response";
import { dataIndexByCode } from "../contracts";
import { MODULES } from "../services/dispatcher";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

const MAX_QUERIES = 80;

interface QueryItem {
  code: string;
  params?: Record<string, unknown>;
}

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = (req.body?.queries as QueryItem[]) ?? [];
    if (!Array.isArray(queries)) {
      throw new HttpError(400, "queries harus berupa array");
    }
    if (queries.length > MAX_QUERIES) {
      throw new HttpError(400, `Maksimal ${MAX_QUERIES} query per request`);
    }
    const idx = dataIndexByCode();

    const out = await Promise.all(
      queries.map(async (q) => {
        const entry = idx.get(q.code);
        if (!entry) {
          return {
            code: q.code,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            data: null,
            error: { code: 404, message: "Code tidak dikenali" },
          };
        }
        const service = MODULES[entry.module];
        try {
          // For now all queryable data are tables; reuse parseTableQuery semantics
          const tq = {
            offset: Number(q.params?.offset ?? 0),
            limit: Math.min(Number(q.params?.limit ?? 15), 50),
            search: typeof q.params?.search === "string" ? q.params.search as string : "",
            searchCols: Array.isArray(q.params?.search_col)
              ? (q.params!.search_col as number[])
              : [],
            sortCol: Number(q.params?.sort_col ?? -1),
            sortOrder:
              q.params?.sort_order === "desc" ? ("desc" as const) : ("asc" as const),
          };
          const data = await service.list(tq);
          return {
            code: q.code,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            data,
          };
        } catch (e) {
          return {
            code: q.code,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            data: null,
            error: { code: 500, message: (e as Error).message },
          };
        }
      })
    );

    ok(res, out);
  } catch (e) {
    next(e);
  }
});

export default router;
