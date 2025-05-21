import {
  createUserAchievementsRepository,
  findAchievementsByUserIdRepository,
  findByAchievementIdAndUserIdRepository,
} from "../repository/user-achievements-repository";
import { getAchievementByNameService } from "./achievements-service";

export async function grantAchievementService(
  achievementName: string,
  userId: string
) {
  const achievement = await getAchievementByNameService(achievementName);

  const userAchievement = await findByAchievementIdAndUserIdRepository(
    achievement!.id,
    userId
  );

  if (userAchievement) return;

  await createUserAchievementsRepository({
    achievementId: achievement?.id,
    userId,
  });
}

export async function getUserAchievements(userId: string) {
  return await findAchievementsByUserIdRepository(userId);
}
