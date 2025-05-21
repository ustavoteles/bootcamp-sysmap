/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `achievements` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,achievementId]` on the table `user_achievements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "achievements_name_key" ON "achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");
