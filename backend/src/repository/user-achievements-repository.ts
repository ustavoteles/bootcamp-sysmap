import prismaClient from "../prisma/prisma-client";

export async function createUserAchievementsRepository(data: any) {
  await prismaClient.userAchievements.create({
    data,
  });
}

export async function findAchievementsByUserIdRepository(userId: string) {
  return await prismaClient.userAchievements.findMany({
    where: {
      userId,
    },
    include: {
      achievement: true,
    },
  });
}

export async function findByAchievementIdAndUserIdRepository(
  achievementId: string,
  userId: string
) {
  return await prismaClient.userAchievements.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });
}
