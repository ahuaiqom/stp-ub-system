import { Router, type Request, type Response, type NextFunction } from "express";
import * as userService from "../services/user.service";
import { ok, created, noContent } from "../utils/response";
import { parsePageQuery } from "../utils/pagination";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/rbac.middleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePageQuery(req.query as any);
    ok(res, await userService.list(page));
  } catch (e) {
    next(e);
  }
});

router.get("/:userid", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await userService.get(String(req.params.userid)));
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await userService.create(req.body));
  } catch (e) {
    next(e);
  }
});

router.put("/:userid", async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await userService.update(String(req.params.userid), req.body));
  } catch (e) {
    next(e);
  }
});

router.delete("/:userid", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.remove(String(req.params.userid));
    noContent(res);
  } catch (e) {
    next(e);
  }
});

export default router;
