/*
  Warnings:

  - You are about to drop the `ActivityAddresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityAddresses" DROP CONSTRAINT "ActivityAddresses_activityId_fkey";

-- DropTable
DROP TABLE "ActivityAddresses";

-- CreateTable
CREATE TABLE "activity_addresses" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "activity_addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activity_addresses" ADD CONSTRAINT "activity_addresses_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
