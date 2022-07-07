/*
  Warnings:

  - You are about to drop the column `endPauseTime` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `isComplete` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `isPaused` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `isStarted` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `pauseTime` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `startPauseTime` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `AssignedTask` table. All the data in the column will be lost.
  - You are about to drop the column `workTime` on the `AssignedTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "endPauseTime",
DROP COLUMN "endTime",
DROP COLUMN "isComplete",
DROP COLUMN "isPaused",
DROP COLUMN "isStarted",
DROP COLUMN "pauseTime",
DROP COLUMN "startPauseTime",
DROP COLUMN "startTime",
DROP COLUMN "workTime",
ADD COLUMN     "isActive" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "TimeLines" (
    "id" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(6),
    "endTime" TIMESTAMP(6),

    CONSTRAINT "TimeLines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeLines" ADD CONSTRAINT "nasjk" FOREIGN KEY ("taskId") REFERENCES "AssignedTask"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
