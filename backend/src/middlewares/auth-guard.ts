import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET!;

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

export default function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Autenticação Necessária");
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const user = jwt.verify(token, jwtSecret) as any;
    console.log("Usuário autenticado:", user);

    req.userId = user.id;
    next();
  } catch (error: any) {
    res.status(401).send("Token inválido ou expirado.");
    console.log(error);
    return;
  }
}
