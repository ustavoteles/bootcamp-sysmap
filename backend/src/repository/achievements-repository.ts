import prismaClient from "../prisma/prisma-client";

export async function createAchievementsRepository(data: any[]) {
  await prismaClient.achievements.createMany({
    data,
    skipDuplicates: true,
  });
}

export async function findAchievementsByNameRepository(name: string) {
  return await prismaClient.achievements.findUniqueOrThrow({
    where: {
      name,
    },
  });
}

export async function getAchievementsCountRepository() {
  return await prismaClient.achievements.count();
}
