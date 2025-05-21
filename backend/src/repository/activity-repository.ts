import { Prisma, PrismaClient } from "@prisma/client";
import prismaClient from "../prisma/prisma-client";
import crypto from "crypto";

export async function createActivitiesRepository(data: any) {
  const typeExists = await prismaClient.activityTypes.create({
    data,
  });
}

function generateConfirmationCode(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function createActivityUserRepository(data: any) {
  const { creatorId, address, ...activityData } = data;

  const confirmationCode = generateConfirmationCode();

  const result = await prismaClient.$transaction(async (prisma) => {
    const activity = await prismaClient.activities.create({
      data: {
        ...activityData,
        creatorId: creatorId,
        confirmationCode: confirmationCode,
      },
    });

    if (address) {
      await prismaClient.activityAddresses.create({
        data: {
          activityId: activity.id,
          latitude: address.latitude,
          longitude: address.longitude,
        },
      });
    }

    return await prismaClient.activities.findUnique({
      where: { id: activity.id },
      include: {
        ActivityAddresses: true,
      },
    });
  });

  return result;
}

export async function getAllActivityTypesRepository() {
  return await prismaClient.activityTypes.findMany();
}

export async function getActivitiesByCreatorRepository(userId: string) {
  return await prismaClient.activities.findMany({
    where: { creatorId: userId },
    include: {
      type: true,
      ActivityAddresses: true,
      ActivityParticipants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getActivitiesByCreatorPaginatedRepository(
  page: number,
  pageSize: number,
  userId: string
) {
  const skip = (page - 1) * pageSize;
  const [activities, totalItems] = await prismaClient.$transaction([
    prismaClient.activityParticipants.findMany({
      where: { userId, approved: true },
      skip,
      take: pageSize,
      include: {
        activity: {
          include: {
            type: true,
            ActivityAddresses: true,
            ActivityParticipants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    }),
    prismaClient.activityParticipants.count({
      where: { userId, approved: true },
    }),
  ]);

  return {
    totalItems,
    activities: activities.map((participant) => participant.activity),
  };
}

export async function getById(id: string) {
  return await prismaClient.activities.findUnique({
    where: {
      id,
    },
  });
}

export async function updateActivityRepository(data: any, id: string) {
  const { ActivityAddresses, ...activity } =
    await prismaClient.activities.update({
      data,
      where: {
        id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        ActivityAddresses: true,
      },
    });
  return {
    ...activity,
    address: ActivityAddresses,
  };
}

export async function updateActivityCompletedAtRepository(
  activityId: string,
  completedAt: Date
) {
  return await prismaClient.activities.update({
    where: { id: activityId },
    data: { completedAt },
  });
}

export async function approveActivityRepository(
  activityId: string,
  userId: string
) {
  return await prismaClient.activityParticipants.update({
    where: {
      userId_activityId: { userId: userId, activityId: activityId },
    },
    data: { approved: true },
  });
}

export async function checkinActivityRepository(
  activityId: string,
  userId: string,
  confirmationCode: string
) {
  const activity = await prismaClient.activities.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    throw new Error("Atividade não encontrada.");
  }

  if (activity.confirmationCode !== confirmationCode) {
    throw new Error("Código de confirmação inválido.");
  }

  const participant = await prismaClient.activityParticipants.update({
    where: {
      userId_activityId: { userId, activityId },
    },
    data: {
      confirmedAt: new Date(),
    },
  });

  return participant;
}

export async function getAllActivitiesRepository(
  typeId?: string,
  orderBy: string = "createdAt",
  order: string = "asc"
) {
  const [activities, totalItems] = await prismaClient.$transaction([
    prismaClient.activities.findMany({
      where: typeId ? { typeId } : {},
      orderBy: { [orderBy]: order },
    }),
    prismaClient.activities.count({
      where: typeId ? { typeId } : {},
    }),
  ]);

  return { activities, totalItems };
}

export async function getAllActivitiesPaginatedRepository(
  page: number,
  pageSize: number,
  typeId?: string,
  orderBy: string = "createdAt",
  order: "asc" | "desc" = "asc"
) {
  const skip = (page - 1) * pageSize;

  const where = typeId ? { typeId } : {};

  const [activities, totalItems] = await prismaClient.$transaction([
    prismaClient.activities.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        [orderBy]: order,
      },
    }),
    prismaClient.activities.count({ where }),
  ]);

  return { activities, totalItems };
}

export async function deleteActivityRepository(activityId: string) {
  await prismaClient.activityParticipants.deleteMany({
    where: { activityId },
  });

  await prismaClient.activityAddresses.deleteMany({
    where: { activityId },
  });

  const activity = await prismaClient.activities.delete({
    where: { id: activityId },
  });

  return activity;
}
