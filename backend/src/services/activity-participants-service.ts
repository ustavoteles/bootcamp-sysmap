import prismaClient from "../prisma/prisma-client";
import {
  getActivitiesByParticipantPaginatedRepository,
  getActivityParticipantsByIdRepository,
  getAllActivityParticipantsRepository,
  unsubscribeToActivityRepository,
} from "../repository/activity-participants-repository";

export async function subscribeUserToActivityService(
  userId: string,
  activityId: string
) {
  const newSubscription = await prismaClient.activityParticipants.create({
    data: {
      userId,
      activityId,
      confirmedAt: new Date(),
    },
  });

  return await newSubscription;
}

export async function unsubscribeUserToActivityService(
  userId: string,
  activityId: string
) {
  return await unsubscribeToActivityRepository(userId, activityId);
}

export async function getAllActivityParticipantsService(userId: string) {
  const { activities, totalItems } = await getAllActivityParticipantsRepository(
    userId
  );

  return { totalItems, data: activities };
}

export async function getAllActivityParticipantsPaginatedService(
  page: number,
  pageSize: number,
  userId: string
) {
  return await getActivitiesByParticipantPaginatedRepository(
    page,
    pageSize,
    userId
  );
}

export async function getActivityParticipantsByIdService(activityId: string) {
  try {
    const participants = await getActivityParticipantsByIdRepository(
      activityId
    );
    return participants;
  } catch (error) {
    throw new Error("Erro ao buscar participantes.");
  }
}
