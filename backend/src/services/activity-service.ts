import prismaClient from "../prisma/prisma-client";
import {
  approveActivityRepository,
  checkinActivityRepository,
  createActivityUserRepository,
  deleteActivityRepository,
  getActivitiesByCreatorPaginatedRepository,
  getActivitiesByCreatorRepository,
  getAllActivitiesPaginatedRepository,
  getAllActivitiesRepository,
  getAllActivityTypesRepository,
  updateActivityCompletedAtRepository,
  updateActivityRepository,
} from "../repository/activity-repository";
import { grantAchievementService } from "./user-achievements-service";

export async function createActivityUserService(data: any) {
  try {
    const activity = await createActivityUserRepository(data);
    return activity;
  } catch (error: any) {
    throw new Error(`Erro ao criar atividade: ${error.message}`);
  }
}

export async function getAllActivitiesService(
  typeId?: string,
  orderBy: string = "createdAt",
  order: string = "asc"
) {
  if (order !== "asc" && order !== "desc") {
    throw new Error("O parâmetro 'order' deve ser 'asc' ou 'desc'.");
  }

  const { activities, totalItems } = await getAllActivitiesRepository(
    typeId,
    orderBy,
    order
  );

  return {
    totalItems,
    data: activities,
  };
}

export async function getAllActivitiesPaginatedService(
  page: number,
  pageSize: number,
  typeId?: string,
  orderBy: string = "createdAt",
  order: string = "asc"
) {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  if (order !== "asc" && order !== "desc") {
    throw new Error("O parâmetro 'order' deve ser 'asc' ou 'desc'.");
  }

  const { activities, totalItems } = await getAllActivitiesPaginatedRepository(
    page,
    pageSize,
    typeId,
    orderBy,
    order
  );

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    meta: {
      totalItems,
      itemCount: activities.length,
      itemsPerPage: pageSize,
      totalPages,
      currentPage: page,
    },
    data: activities,
  };
}

export async function getAllActivityTypesService() {
  return await getAllActivityTypesRepository();
}

export async function getActivitiesByCreatorService(userId: string) {
  return await getActivitiesByCreatorRepository(userId);
}

export async function getActivitiesByCreatorServicePaginated(
  page: number,
  pageSize: number,
  userId: string
) {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  const { activities, totalItems } =
    await getActivitiesByCreatorPaginatedRepository(page, pageSize, userId);

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    meta: {
      totalItems,
      itemCount: activities.length,
      itemsPerPage: pageSize,
      totalPages,
      currentPage: page,
    },
    data: activities,
  };
}

export async function updateActivityUserService(data: any, id: string) {
  return await updateActivityRepository(data, id);
}

export async function concludeActivityService(activityId: string) {
  const completedAt = new Date();
  return await updateActivityCompletedAtRepository(activityId, completedAt);
}

export async function approveActivityService(
  activityId: string,
  userId: string
) {
  try {
    return await approveActivityRepository(activityId, userId);
  } catch (error: any) {
    throw new Error("Erro ao aprovar participante: " + error.message);
  }
}

export async function checkinActivityService(
  activityId: string,
  userId: string,
  confirmationCode: string
) {
  try {
    const participant = await checkinActivityRepository(
      activityId,
      userId,
      confirmationCode
    );

    const checkInCount = await prismaClient.activityParticipants.count({
      where: {
        userId,
        confirmedAt: { not: null },
      },
    });

    if (checkInCount === 1) {
      await grantAchievementService("Explorador Iniciante", userId);
    }

    return participant;
  } catch (error: any) {
    throw new Error("Erro ao realizar check-in: " + error.message);
  }
}

export async function deleteActivityService(activityId: string) {
  const activity = await deleteActivityRepository(activityId);
  if (!activity) {
    throw new Error("Atividade não encontrada.");
  }

  return { message: "Atividade deletada com sucesso." };
}
