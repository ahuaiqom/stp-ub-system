import { Router, Request, Response, NextFunction } from "express";
import { validateLoginInput } from "../validators/auth.validator";
import * as authService from "../services/auth.service";
import { ok } from "../utils/response";
import { REFRESH_TTL_SECONDS } from "../utils/jwt";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

const COOKIE_NAME = "refresh_token";
const COOKIE_SECURE = String(process.env.COOKIE_SECURE).toLowerCase() === "true";

const setRefreshCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SECURE ? "none" : "lax",
    path: "/",        // accessible to /auth/refresh AND /auth/logout
    maxAge: REFRESH_TTL_SECONDS * 1000,
  });
};

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = validateLoginInput(req.body);
      const result = await authService.login(username, password);
      setRefreshCookie(res, result.refreshToken);
      ok(res, {
        accessToken: result.accessToken,
        expDate: result.expDate,
        user: result.user,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = (req as any).cookies?.[COOKIE_NAME] as string | undefined;
      if (!token) {
        res.status(400).json({
          timestamp: new Date().toISOString(),
          response: null,
          error: { code: 400, message: "refresh_token tidak ditemukan pada cookie" },
        });
        return;
      }
      const result = await authService.refresh(token);
      setRefreshCookie(res, result.refreshToken);
      ok(res, {
        accessToken: result.accessToken,
        expDate: result.expDate,
        user: result.user,
      });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/logout",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = (req as any).cookies?.[COOKIE_NAME] as string | undefined;
      if (!token) {
        res.status(400).json({
          timestamp: new Date().toISOString(),
          response: null,
          error: { code: 400, message: "refresh_token tidak ditemukan pada cookie" },
        });
        return;
      }
      await authService.logout(token);
      res.clearCookie(COOKIE_NAME, { path: "/" });
      ok(res, {});
    } catch (e) {
      next(e);
    }
  }
);

export default router;
