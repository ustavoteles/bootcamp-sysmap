import prismaClient from "../prisma/prisma-client";
import userData from "../types/user-data";

export async function getUserRepository(id: string) {
  return await prismaClient.users.findUnique({
    where: {
      id,
    },
    include: {
      UserAchievements: {
        include: {
          achievement: true,
        },
      },
    },
  });
}
export async function getByEmail(email: string) {
  return await prismaClient.users.findUnique({
    where: {
      email,
    },
    include: {
      UserAchievements: {
        select: {
          achievement: {
            select: {
              name: true,
              criterion: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserPreferencesRepository(userId: string) {
  return await prismaClient.preferences.findMany({
    where: { userId },
    select: {
      typeId: true,
      activityType: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function create(data: userData) {
  return await prismaClient.users.create({
    data,
  });
}

export async function updateUserRepository(data: any, id: string) {
  return await prismaClient.users.update({
    data,
    where: {
      id,
    },
  });
}

export async function defineUserPreferencesRepository(
  userId: string,
  typeIds: string[]
) {
  await prismaClient.$transaction([
    prismaClient.preferences.deleteMany({ where: { userId } }),
    prismaClient.preferences.createMany({
      data: typeIds.map((typeId) => ({ userId, typeId })),
      skipDuplicates: true,
    }),
  ]);
}

export async function softDeleteUserRepository(userId: string) {
  const user = await prismaClient.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (user.deletedAt) {
    throw new Error("Usuário já foi excluído.");
  }

  return await prismaClient.users.update({
    where: { id: userId },
    data: { deletedAt: new Date() }, // Define a data/hora atual como deletedAt
  });
}
