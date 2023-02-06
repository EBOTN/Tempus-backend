/*
  Warnings:

  - You are about to drop the column `Role` on the `ProjectMembers` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `WorkSpaceMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "Role",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'Member';

-- AlterTable
ALTER TABLE "WorkSpaceMembers" DROP COLUMN "Role",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'Member';
