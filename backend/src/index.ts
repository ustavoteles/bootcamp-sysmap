import express, { json } from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swagger from "swagger-ui-express";
import docs from "./swagger.json";
import dotenv from "dotenv";
dotenv.config();

import userController from "./controllers/user-controller";
import authController from "./controllers/auth-controller";
import { createAchievementsService } from "./services/achievements-service";
import activityController from "./controllers/activity-controller";
import { createBucket } from "./services/s3-service";
import path from "path";

const server = express();

server.use("/docs", swagger.serve, swagger.setup(docs));
server.use("/public", express.static(path.join(__dirname, "../public"))); // Servindo arquivos da pasta 'public'

server.use(json());
server.use(cors());

userController(server);
authController(server);
activityController(server);

createAchievementsService([
  {
    name: "Novato",
    criterion: "Crie sua conta.",
  },
  {
    name: "Primeiro Login",
    criterion: "Faça login pela primeira vez.",
  },
  {
    name: "Explorador Iniciante",
    criterion: "Complete seu primeiro check-in em uma atividade.",
  },
]);

createBucket();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Servidor rodando em http://localhost:3000");
  console.log("Documentação disponível em http://localhost:3000/docs");
});
