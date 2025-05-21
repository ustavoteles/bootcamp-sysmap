import { Router, Express } from "express";
import authGuard from "../middlewares/auth-guard";
import { getActivitiesByCreatorPaginatedRepository } from "../repository/activity-repository";
import { getUserById } from "../services/user-service";
import {
  getActivityParticipantsByIdService,
  getAllActivityParticipantsPaginatedService,
  getAllActivityParticipantsService,
  subscribeUserToActivityService,
  unsubscribeUserToActivityService,
} from "../services/activity-participants-service";
import {
  approveActivityService,
  checkinActivityService,
  concludeActivityService,
  createActivityUserService,
  deleteActivityService,
  getActivitiesByCreatorService,
  getAllActivitiesPaginatedService,
  getAllActivitiesService,
  getAllActivityTypesService,
  updateActivityUserService,
} from "../services/activity-service";
import { isActiveMiddleware } from "../middlewares/isActiveMiddleware";

const activityController = (server: Express) => {
  const router = Router();
  router.use(authGuard);
  router.use(isActiveMiddleware);

  router.get("/types", async (req, res) => {
    try {
      const activityTypes = await getAllActivityTypesService();
      res.status(200).send(activityTypes);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar tipos de atividade.");
      console.error(error.message);
      return;
    }
  });

  router.get("/all", async (req, res) => {
    try {
      const { typeId, orderBy, order } = req.query as {
        typeId: string;
        orderBy: string;
        order: string;
      };

      const activities = await getAllActivitiesService(typeId, orderBy, order);

      res.status(200).send(activities);
      return;
    } catch (error: any) {
      if (error.message === "DEACTIVATED_ACCOUNT") {
        res
          .status(403)
          .send("Esta conta foi desativada e não pode ser utilizada");
        return;
      }
      res.status(500).json("Erro inesperado");
      return;
    }
  });

  router.get("/", async (req, res) => {
    try {
      const { page, pageSize, typeId, orderBy, order } = req.query as {
        page: string;
        pageSize: string;
        typeId: string;
        orderBy: string;
        order: string;
      };

      const activities = await getAllActivitiesPaginatedService(
        parseInt(page),
        parseInt(pageSize),
        typeId,
        orderBy,
        order
      );

      res.status(200).send(activities);
      return;
    } catch (error: any) {
      if (error.message === "DEACTIVATED_ACCOUNT") {
        res
          .status(403)
          .send("Esta conta foi desativada e não pode ser utilizada");
        return;
      }
      res.status(500).json("Erro inesperado");
      return;
    }
  });

  router.get("/user/creator", async (req, res) => {
    try {
      const { page, pageSize } = req.query as {
        page: string;
        pageSize: string;
      };
      const userId = req.userId!;

      const activities = await getActivitiesByCreatorPaginatedRepository(
        parseInt(page),
        parseInt(pageSize),
        userId
      );
      res.status(200).send(activities);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar atividades do criador.");
      console.error(error.message);
      return;
    }
  });

  router.get("/user/creator/all", async (req, res) => {
    const userId = req.userId!;
    try {
      const activities = await getActivitiesByCreatorService(userId);
      res.status(200).send(activities);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar atividades do criador.");
      console.error(error.message);
      return;
    }
  });

  router.get("/user/participant/", async (req, res) => {
    try {
      const { page, pageSize } = req.query as {
        page: string;
        pageSize: string;
      };
      const userId = req.userId!;

      const activities = await getAllActivityParticipantsPaginatedService(
        parseInt(page),
        parseInt(pageSize),
        userId
      );

      res.status(200).json(activities);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar atividades do participante.");
      console.error(error.message);
      return;
    }
  });

  router.get("/user/participant/all", async (req, res) => {
    const userId = req.userId!;
    try {
      const activities = await getAllActivityParticipantsService(userId);
      res.status(200).send(activities);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar atividades do participante.");
      console.error(error.message);
      return;
    }
  });

  router.get("/:id/participants", async (req, res) => {
    const activityId = req.params.id;
    try {
      const participants = await getActivityParticipantsByIdService(activityId);
      res.status(200).json(participants);
      return;
    } catch (error: any) {
      res.status(500).send("Erro ao listar participantes da atividade.");
      console.error(error.message);
      return;
    }
  });

  router.post("/new", async (req, res) => {
    const userId = req.userId!;
    const activityData = {
      ...req.body,
      creatorId: userId,
    };
    try {
      const activity = await createActivityUserService(activityData);

      res.status(201).send(activity);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao criar atividade.");
      return;
    }
  });

  router.post("/:id/subscribe", async (req, res) => {
    const userId = req.userId!;
    const activityId = req.params.id;
    try {
      const subscription = await subscribeUserToActivityService(
        userId,
        activityId
      );
      res.status(200).json(subscription);
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/:id/update", async (req, res) => {
    const activityId = req.params.id;
    const activityData = req.body;
    const activity = await updateActivityUserService(activityData, activityId);
    try {
      res.status(200).json({
        success: true,
        message: "Atividade atualizada com sucesso",
        data: activity,
      });
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/:id/conclude", async (req, res) => {
    const activityId = req.params.id;

    try {
      const activity = await concludeActivityService(activityId);
      res.status(200).json({ message: "Atividade concluida com sucesso" });
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/:id/approve", async (req, res) => {
    const activityId = req.params.id;
    const { userId } = req.body;

    try {
      const activity = await approveActivityService(activityId, userId);
      res.status(200).json({ message: "Participante aprovado com sucesso" });
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/:id/approve", async (req, res) => {
    const activityId = req.params.id;
    const { userId } = req.body;

    try {
      const activity = await approveActivityService(activityId, userId);
      res.status(200).json({ message: "Participante aprovado com sucesso" });
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.put("/:id/check-in", async (req, res) => {
    const activityId = req.params.id;
    const userId = req.userId!;

    const { confirmationCode } = req.body;
    try {
      const checkin = await checkinActivityService(
        activityId,
        userId,
        confirmationCode
      );

      res.status(200).send("Participação confirmada com sucesso");
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.delete("/:id/unsubscribe", async (req, res) => {
    const userId = req.userId!;
    const activityId = req.params.id;
    try {
      const unsubscribed = await unsubscribeUserToActivityService(
        userId,
        activityId
      );
      res.status(201).send(unsubscribed);
      return;
    } catch (error: any) {
      res.status(400).send(error.message);
      return;
    }
  });

  router.delete("/:id/delete", async (req, res) => {
    const activityId = req.params.id;
    try {
      const deleted = await deleteActivityService(activityId);
      res.status(200).json(deleted);
      return;
    } catch (error: any) {
      res.status(400).send({ error: error.message });
      return;
    }
  });

  server.use("/activities", router);
};

export default activityController;
