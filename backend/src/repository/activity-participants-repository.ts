import prismaClient from "../prisma/prisma-client";

export async function subscribeToActivityRepository(
  userId: string,
  activityId: string
) {
  const existingSubscription = await prismaClient.activityParticipants.create({
    data: {
      userId,
      activityId,
      confirmedAt: new Date(),
    },
    include: {
      activity: {
        select: {
          title: true,
          scheduledDate: true,
        },
      },
    },
  });
}

export async function unsubscribeToActivityRepository(
  userId: string,
  activityId: string
) {
  try {
    const existingSubscription =
      await prismaClient.activityParticipants.findUnique({
        where: {
          userId_activityId: {
            userId,
            activityId,
          },
        },
      });

    if (!existingSubscription) {
      throw new Error("Usuário não está inscrito nesta atividade.");
    }

    const deletedSubscription = await prismaClient.activityParticipants.delete({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
    });

    return {
      id: deletedSubscription.id,
      userId: deletedSubscription.userId,
      activityId: deletedSubscription.activityId,
      confirmedAt: deletedSubscription.confirmedAt,
    };
  } catch (error: any) {
    throw new Error(
      `Erro ao cancelar inscrição na atividade: ${error.message}`
    );
  }
}

export async function getAllActivityParticipantsRepository(userId: string) {
  const [activities, totalItems] = await prismaClient.$transaction([
    prismaClient.activities.findMany({
      where: {
        ActivityParticipants: {
          some: {
            userId,
            confirmedAt: {
              not: null,
            },
            approved: true,
          },
        },
      },
      include: {
        type: true,
        ActivityAddresses: true,
        ActivityParticipants: {
          where: {
            confirmedAt: { not: null },
          },
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
    }),
    prismaClient.activities.count({
      where: {
        ActivityParticipants: {
          some: {
            userId,
            confirmedAt: {
              not: null,
            },
            approved: true,
          },
        },
      },
    }),
  ]);

  return { totalItems, activities };
}

export async function getActivitiesByParticipantPaginatedRepository(
  page: number,
  pageSize: number,
  userId: string
) {
  const skip = (page - 1) * pageSize;

  const [activities, totalItems] = await prismaClient.$transaction([
    prismaClient.activityParticipants.findMany({
      where: { userId },
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
    prismaClient.activityParticipants.count({ where: { userId } }),
  ]);

  return { totalItems, activities };
}

export async function getActivityParticipantsByIdRepository(
  activityId: string
) {
  try {
    const participants = await prismaClient.activityParticipants.findMany({
      where: { activityId },
      select: {
        id: true,
        approved: true,
        confirmedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return participants.map((participant) => ({
      id: participant.id,
      userid: participant.user.id,
      name: participant.user.name,
      avatar: participant.user.avatar,
      subscriptionStatus: participant.approved,
      confirmedAt: participant.confirmedAt,
    }));
  } catch (error) {
    throw new Error("Erro ao buscar participantes da atividade.");
  }
}
