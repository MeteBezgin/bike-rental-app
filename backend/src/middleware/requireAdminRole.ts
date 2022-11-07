import { Request, Response, NextFunction } from "express";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const role = res.locals.user.role;
  if (role !== "MANAGER") {
    return res.sendStatus(403);
  } else {
    return next();
  }
};

export default requireAdmin;
