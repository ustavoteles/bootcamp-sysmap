/*
  Warnings:

  - A unique constraint covering the columns `[userId,typeId]` on the table `preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "preferences_userId_typeId_key" ON "preferences"("userId", "typeId");
