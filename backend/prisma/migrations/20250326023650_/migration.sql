/*
  Warnings:

  - Made the column `xp` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `level` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "xp" SET NOT NULL,
ALTER COLUMN "xp" SET DEFAULT 0,
ALTER COLUMN "level" SET NOT NULL,
ALTER COLUMN "level" SET DEFAULT 0;
