import { getByEmail } from "../repository/user-repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { grantAchievementService } from "./user-achievements-service";
import { createUser } from "./user-service";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

const jwtSecret = process.env.JWT_SECRET!;

export async function createAccountService(userData: any) {
  try {
    const user = await createUser({ ...userData, avatar: "" });
    await grantAchievementService("Novato", user.id);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("DUPLICATE_ENTRY");
      }

      if (error instanceof PrismaClientValidationError) {
        {
          throw new Error("MISSING_FIELDS");
        }
      }
    }
  }
}

export async function signInService(email: string, password: string) {
  const user = await getByEmail(email);

  if (!user) {
    throw new Error("NOT_FOUND");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("INCORRECT_PASSWORD");
  }

  if (user.deletedAt != null) {
    throw new Error("DEACTIVATED_ACCOUNT");
  }
  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1d" });
  await grantAchievementService("Primeiro Login", user.id);

  return token;
}
