import { Express, Router } from "express";
import validateRequestBody from "../middlewares/request-body-validator";
import authValidation from "../validations/auth-validation";
import userValidation from "../validations/user-validation";
import { createUser, getUserById } from "../services/user-service";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { signInService } from "../services/auth-service";
import { getByEmail, getUserRepository } from "../repository/user-repository";

const jwtSecret = process.env.JWT_SECRET!;

const authController = (server: Express) => {
  const router = Router();

  router.post(
    "/sign-in",
    validateRequestBody(authValidation),
    async (req, res) => {
      try {
        const { email, password } = req.body;
        const userToken = await signInService(email, password);
        const userdata = await getByEmail(email);
        if (userdata) {
          const {
            password: _,
            deletedAt: __,
            ...userWithoutPassword
          } = userdata;
          res.status(200).json({ token: userToken, user: userWithoutPassword });
          return;
        }
      } catch (error: any) {
        if (error.message === "NOT_FOUND") {
          res.status(404).send("Usuário não encontrado");
          return;
        }
        if (error.message === "INCORRECT_PASSWORD") {
          res.status(401).send("Senha incorreta.");
          return;
        }

        if (error.message === "DEACTIVATED_ACCOUNT") {
          res
            .status(403)
            .send("Esta conta foi desativada e não pode ser utilizada");
          return;
        }
        if (error instanceof PrismaClientValidationError) {
          res.status(400).send("Informe os campos obrigatórios corretamente.");
          return;
        } else {
          res.status(500).send("Erro inesperado");
          return;
        }
      }
    }
  );

  router.post(
    "/register",
    validateRequestBody(userValidation),
    async (req, res) => {
      try {
        const userData = req.body;
        await createUser(userData);

        res.status(201).json({ message: "Usuário criado com sucesso" });
        return;
      } catch (error: any) {
        if (error.message === "MISSING_FIELDS") {
          if (error instanceof PrismaClientValidationError) {
            res
              .status(400)
              .send("Informe os campos obrigatórios corretamente.");
          }
          return;
        }
        if (error.message === "DUPLICATE_ENTRY") {
          res.status(409).json({
            message: "O e-mail ou CPF informado já pertence a outro usuário",
          });
          return;
        } else {
          res.status(500).json({ message: "Erro inesperado" });
          return;
        }
      }
    }
  );

  server.use("/auth", router);
};

export default authController;
