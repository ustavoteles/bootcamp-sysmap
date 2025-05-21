import {
  createAchievementsRepository,
  findAchievementsByNameRepository,
  getAchievementsCountRepository,
} from "../repository/achievements-repository";

export async function createAchievementsService(achievements: any[]) {
  const achievementsCount = await getAchievementsCountRepository();
  if (achievements.length === achievementsCount) return;

  await createAchievementsRepository(achievements);
}

export async function getAchievementByNameService(name: string) {
  return await findAchievementsByNameRepository(name);
}
