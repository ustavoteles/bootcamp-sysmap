import { Express, Router } from "express";
import authGuard from "../middlewares/auth-guard";
import {
  defineUserPreferencesService,
  getUserById,
  getUserPreferencesService,
  softDeleteUserService,
  updateUserService,
} from "../services/user-service";
import upload from "../multer/multer";
import { uploadImage } from "../services/s3-service";
import { isActiveMiddleware } from "../middlewares/isActiveMiddleware";

const userController = (server: Express) => {
  const router = Router();
  router.use(authGuard);
  router.use(isActiveMiddleware);

  router.get("/", async (req, res) => {
    try {
      const userId = req.userId!;
      const user = await getUserById(userId);
      if (user) {
        const { password: _, deletedAt: __, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
        return;
      }
    } catch (error: any) {
      if (error.message === "NOT_FOUND") {
        res.status(404).send("Usuário não encontrado");
        return;
      }
      if (error.message === "DEACTIVATED_ACCOUNT") {
        res
          .status(403)
          .send("Esta conta foi desativada e não pode ser utilizada");
        return;
      }
      res.status(500).json("Erro inesperado");
    }
  });

  router.get("/preferences", async (req, res) => {
    const userId = req.userId!;
    try {
      const userpreferences = await getUserPreferencesService(userId);
      res.status(200).send(userpreferences);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar preferencias");
      console.error(error.message);
      return;
    }
  });

  router.post("/preferences/define", async (req, res) => {
    const userId = req.userId!;
    const { typeId } = req.body;

    if (!typeId || !Array.isArray(typeId)) {
      res
        .status(400)
        .json({ error: 'O campo "typeIds" deve ser um array válido.' });
      return;
    }

    const updatedUser = await defineUserPreferencesService(userId, typeId);
    try {
      res.status(200).json({ message: "Preferências atualizadas com sucesso" });
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/avatar", upload.single("file"), async (req, res) => {
    const userId = req.userId!;

    try {
      const file = req.file;
      if (!file) {
        res.status(400).send("A imagem deve ser um arquivo PNG ou JPG.");
        return file;
      }
      const fileUrl = await uploadImage(file);
      const updatedUser = await updateUserService({ avatar: fileUrl }, userId);
      res.status(200).send({
        message: "Foto de perfil atualizada com sucesso.",
        avatar: updatedUser.avatar,
      });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });

  router.put("/update", async (req, res) => {
    const userId = req.userId!;
    const userData = req.body;

    const updatedUser = await updateUserService(userData, userId);
    const { deletedAt: _, ...userWithoutDeletedAt } = updatedUser;

    try {
      res.status(201).send(userWithoutDeletedAt);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  });

  router.delete("/deactivate", async (req, res) => {
    const userId = req.userId!;

    try {
      await softDeleteUserService(userId);
      res.status(200).send({ message: "Usuário excluído com sucesso." });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  });
  server.use("/user", router);
};

export default userController;
