import { Router, Request, Response } from "express";
import { ok, fail } from "../utils/response";
import { pool } from "../config/db";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    ok(res, { status: "ok" });
  } catch {
    fail(res, 503, "service unhealthy");
  }
});

export default router;
