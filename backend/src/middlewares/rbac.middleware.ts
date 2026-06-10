import type { Request, Response, NextFunction } from "express";
import { fail } from "../utils/response";

const KST = process.env.KST_IDENTIFIER || "kst_jatikerto";

/**
 * Allow only requests whose JWT carries one of the listed roles
 * for *this* KST. Per contract section 5, RBAC is enforced locally
 * by each KST using `roles[kstIdentifier]`.
 */
export const requireRole = (...allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.auth;
    if (!auth) {
      fail(res, 401, "Tidak terautentikasi");
      return;
    }
    const roles = auth.roles?.[KST] ?? [];
    const ok = roles.some((r) => allowed.includes(r));
    if (!ok) {
      fail(res, 403, "Tidak memiliki akses ke resource ini");
      return;
    }
    next();
  };
};
