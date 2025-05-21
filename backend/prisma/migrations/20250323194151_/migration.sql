/*
  Warnings:

  - You are about to drop the column `ScheduledDate` on the `activities` table. All the data in the column will be lost.
  - Added the required column `scheduledDate` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" DROP COLUMN "ScheduledDate",
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP NOT NULL;
