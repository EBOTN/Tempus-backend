/*
  Warnings:

  - You are about to drop the column `memberId` on the `ProjectMembers` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `ProjectMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMembers" DROP CONSTRAINT "member_fkey";

-- DropIndex
DROP INDEX "ProjectMembers_projectId_memberId_key";

-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "memberId",
ADD COLUMN     "member_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "member_fkey" FOREIGN KEY ("member_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
