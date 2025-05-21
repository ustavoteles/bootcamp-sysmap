import { Request, Response, NextFunction } from "express";

import { ZodSchema } from "zod";

export default function validateRequestBody(schema: ZodSchema) {
  return function requestBodyValidator(
    req: Request,

    res: Response,

    next: NextFunction
  ) {
    try {
      schema.parse(req.body);

      next();
    } catch (error: any) {
      res.status(400).send("Informe os campos obrigatórios corretamente.");
    }
  };
}
