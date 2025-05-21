/*
  Warnings:

  - A unique constraint covering the columns `[userId,activityId]` on the table `activity_participants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "activity_participants" ALTER COLUMN "approved" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "activity_participants_userId_activityId_key" ON "activity_participants"("userId", "activityId");
