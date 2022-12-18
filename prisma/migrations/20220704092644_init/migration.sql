-- AlterTable
ALTER TABLE "AssignedTask" ADD COLUMN     "isComplete" BOOLEAN DEFAULT false,
ADD COLUMN     "isStarted" BOOLEAN DEFAULT false;
