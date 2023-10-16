/*
  Warnings:

  - You are about to drop the column `member_id` on the `ProjectMembers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,memberId]` on the table `ProjectMembers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `ProjectMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMembers" DROP CONSTRAINT "member_fkey";

-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "member_id",
ADD COLUMN     "memberId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "projectId" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_projectId_memberId_key" ON "ProjectMembers"("projectId", "memberId");

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "member_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
