import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodTypeAny } from "zod";

export const validateBody = <T extends ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
};

export const validateQuery = <T extends AnyZodObject>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.query = schema.parse(req.query) as Request["query"];
    next();
  };
};

export const validateParams = <T extends AnyZodObject>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.params = schema.parse(req.params);
    next();
  };
};
