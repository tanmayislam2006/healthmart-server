import { NextFunction, Request, Response } from "express";
import { auth as authFromLibs } from "./../libs/auth.js";
import { UserRole } from "../generated/prisma/enums.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
const auth = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await authFromLibs.api.getSession({
        headers: req.headers as any,
      });
      if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role,
        emailVerified: session.user.emailVerified!,
      };
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verify your email!",
        });
      }

      if (role.length && !role.includes(session.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden You don't have permission to access this resources!",
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
export default auth;
