/**
 * Public (unauthenticated) endpoints used by the public-facing
 * site to display read-only data tables.
 */
import { Router, type Request, type Response, type NextFunction } from "express";
import { ok } from "../utils/response";
import * as pertanian from "../services/pertanian.service";
import * as peternakan from "../services/peternakan.service";
import * as akademik from "../services/akademik.service";
import * as konservasi from "../services/konservasi.service";
import * as konservasiTanaman from "../services/konservasiTanaman.service";
import * as kemitraan from "../services/kemitraan.service";
import { parsePageQuery } from "../utils/pagination";

const router = Router();

const wrap =
  <T>(fn: (req: Request) => Promise<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      ok(res, await fn(req));
    } catch (e) {
      next(e);
    }
  };

const opts = (req: Request) => {
  const page = parsePageQuery(req.query as any);
  const search = typeof req.query.search === "string" ? req.query.search : "";
  return { ...page, search };
};

router.get("/pertanian",          wrap((req) => pertanian.listPublic(opts(req))));
router.get("/peternakan",         wrap((req) => peternakan.listPublic(opts(req))));
router.get("/akademik",           wrap((req) => akademik.listPublic(opts(req))));
router.get("/konservasi/hewan",   wrap((req) => konservasi.listPublic(opts(req))));
router.get("/konservasi/tanaman", wrap((req) => konservasiTanaman.listPublic(opts(req))));

/**
 * Live stats for the public Agroindustry Partnership section.
 * Counts only partnerships whose `tanggal_selesai >= today`
 * (or NULL = open-ended), so the numbers self-update.
 */
router.get("/kemitraan/stats", wrap(async () => kemitraan.getActiveStats()));

export default router;
