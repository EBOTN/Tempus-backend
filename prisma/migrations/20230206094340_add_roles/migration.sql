-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Owner', 'Manager', 'Member');

-- AlterTable
ALTER TABLE "ProjectMembers" ADD COLUMN     "Role" "Roles" NOT NULL DEFAULT 'Member';

-- AlterTable
ALTER TABLE "WorkSpaceMembers" ADD COLUMN     "Role" "Roles" NOT NULL DEFAULT 'Member';
