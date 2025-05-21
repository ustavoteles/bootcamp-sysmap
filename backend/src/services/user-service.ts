import {
  create,
  defineUserPreferencesRepository,
  getByEmail,
  getUserPreferencesRepository,
  getUserRepository,
  softDeleteUserRepository,
  updateUserRepository,
} from "../repository/user-repository";
import bcrypt from "bcryptjs";
import {
  getUserAchievements,
  grantAchievementService,
} from "./user-achievements-service";

export const getUserService = async (id: string) => {
  const user = await getUserRepository(id);

  if (!user) {
    throw new Error("NOT_FOUND");
  }

  return user;
};

export async function createUser(data: any) {
  const encryptedPassword = await bcrypt.hash(data.password, 10);
  data.password = encryptedPassword;
  const defaultAvatar =
    "http://localhost:3000/public/images/default-avatar.jpg";

  const user = await create({
    ...data,
    avatar: data.avatar || defaultAvatar,
  });
  await grantAchievementService("Novato", user.id);
  return user;
}

export async function getUserById(id: string) {
  const user = await getUserRepository(id);
  const userAchievements = await getUserAchievements(id);

  const mappedUserAchievements = user?.UserAchievements.map(
    (userAchievement) => userAchievement.achievement
  );

  return user;
}

export async function getUserPreferencesService(userId: string) {
  return await getUserPreferencesRepository(userId);
}

export async function updateUserService(data: any, id: string) {
  return await updateUserRepository(data, id);
}

export async function defineUserPreferencesService(
  userId: string,
  typeIds: string[]
) {
  try {
    await defineUserPreferencesRepository(userId, typeIds);
  } catch (error: any) {
    throw new Error(
      `Erro ao definir preferências para o usuário: ${error.message}`
    );
  }
}

export async function softDeleteUserService(userId: string) {
  return await softDeleteUserRepository(userId);
}
