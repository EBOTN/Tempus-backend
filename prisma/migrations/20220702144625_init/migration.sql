/*
  Warnings:

  - A unique constraint covering the columns `[taskId,workerId]` on the table `AssignedTask` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssignedTask_taskId_workerId_key" ON "AssignedTask"("taskId", "workerId");
