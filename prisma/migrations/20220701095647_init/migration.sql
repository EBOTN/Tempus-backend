/*
  Warnings:

  - You are about to drop the column `workerId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "worker_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "workerId";

-- CreateTable
CREATE TABLE "AssignedTask" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "workerId" INTEGER,
    "startTime" DATE,
    "endTime" DATE,

    CONSTRAINT "AssignedTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "user_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "task_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
