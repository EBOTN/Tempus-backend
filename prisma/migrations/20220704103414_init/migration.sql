-- AlterTable
ALTER TABLE "AssignedTask" ADD COLUMN     "endPauseTime" TIMESTAMP(6),
ADD COLUMN     "isPaused" BOOLEAN DEFAULT false,
ADD COLUMN     "pauseTime" INTEGER,
ADD COLUMN     "startPauseTime" TIMESTAMP(6),
ADD COLUMN     "workTime" INTEGER;
