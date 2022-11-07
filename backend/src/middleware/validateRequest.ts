import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../utils/logger";

export const validateRequest =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      return next();
    } catch (error: any) {
      log.error(error);
      return res.status(400).send(error.message);
    }
  };
