import { Router, type Request, type Response } from "express";
import { ok } from "../utils/response";
import { buildContract } from "../contracts";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, (req: Request, res: Response) => {
  const perm = req.query.permission === "r" ? "r" : "rw";
  ok(res, buildContract(perm));
});

export default router;
