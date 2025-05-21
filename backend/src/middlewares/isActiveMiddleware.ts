// isActiveMiddleware.ts

import prismaClient from "../prisma/prisma-client";

export const isActiveMiddleware = async (req: any, res: any, next: any) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).send({ error: "Usuário não autenticado." });
  }

  const user = await prismaClient.users.findUnique({
    where: { id: userId },
  });

  if (!user || user.deletedAt) {
    return res
      .status(400)
      .send({
        error: "Usuário desativado. Não é possível realizar essa ação.",
      });
  }

  next();
};
