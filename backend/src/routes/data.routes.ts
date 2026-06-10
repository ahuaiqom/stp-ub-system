/**
 * /data/{path} dispatcher.
 *
 * The path comes from the contract (e.g. "/pertanian/items") and
 * is encoded into the URL like:
 *   GET /api/data/pertanian/items
 * The router uses Express 5 wildcard `{*path}` to capture the rest.
 */
import { Router, type Request, type Response, type NextFunction } from "express";
import { ok, HttpError } from "../utils/response";
import { parseTableQuery } from "../utils/pagination";
import { dataIndex } from "../contracts";
import { MODULES } from "../services/dispatcher";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";
import { pool } from "../config/db";

const router = Router();

router.use(requireAuth);

const resolveModule = (req: Request) => {
  // path captured by the route segment after "/data"
  const captured = (req.params as any).path as string | string[] | undefined;
  const segments =
    Array.isArray(captured) ? captured : (captured ? captured.split("/") : []);
  const path = "/" + segments.filter(Boolean).join("/");
  const idx = dataIndex();
  const entry = idx.get(path);
  if (!entry) throw new HttpError(404, `Path data ${path} tidak ditemukan`);
  const service = MODULES[entry.module];
  if (!service) throw new HttpError(404, `Modul ${entry.module} tidak terdaftar`);
  return { entry, service };
};

const lookupInternalUserId = async (userUuid: string): Promise<number | null> => {
  if (!userUuid) return null;
  const r = await pool.query<{ user_id: number }>(
    `SELECT user_id FROM users WHERE user_uuid = $1`,
    [userUuid]
  );
  return r.rowCount ? r.rows[0].user_id : null;
};

router.get(
  "/{*path}",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entry, service } = resolveModule(req);
      const q = parseTableQuery(req.query as any);
      const data = await service.list(q);
      ok(res, {
        code: entry.desc.code,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        data,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/{*path}",
  requireRole("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { service } = resolveModule(req);
      const body = req.body as { typeName?: string; newValue?: any[] };
      if (body?.typeName !== "table" || !Array.isArray(body.newValue)) {
        throw new HttpError(400, "Payload tidak sesuai skema table");
      }
      const userId = await lookupInternalUserId(req.auth!.sub);
      const rowIds = await service.insert(body.newValue, userId);
      ok(res, { rowIds });
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/{*path}",
  requireRole("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { service } = resolveModule(req);
      const body = req.body as { typeName?: string; newValue?: any[] };
      if (body?.typeName !== "table" || !Array.isArray(body.newValue)) {
        throw new HttpError(400, "Payload tidak sesuai skema table");
      }
      const userId = await lookupInternalUserId(req.auth!.sub);
      await service.patch(body.newValue, userId);
      ok(res, { message: "Data berhasil dimodifikasi." });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
