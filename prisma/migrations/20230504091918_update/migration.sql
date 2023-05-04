/*
  Warnings:

  - You are about to drop the column `workerId` on the `AssignedTask` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId,memberId]` on the table `AssignedTask` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `AssignedTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignedTask" DROP CONSTRAINT "user_fkey";

-- DropIndex
DROP INDEX "AssignedTask_taskId_workerId_key";

-- AlterTable
ALTER TABLE "AssignedTask" DROP COLUMN "workerId",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AssignedTask_taskId_memberId_key" ON "AssignedTask"("taskId", "memberId");

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "member_fkey" FOREIGN KEY ("memberId") REFERENCES "ProjectMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
