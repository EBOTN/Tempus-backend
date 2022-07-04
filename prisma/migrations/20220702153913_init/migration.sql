-- DropForeignKey
ALTER TABLE "AssignedTask" DROP CONSTRAINT "task_fkey";

-- DropForeignKey
ALTER TABLE "AssignedTask" DROP CONSTRAINT "user_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "creator_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "creator_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "user_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTask" ADD CONSTRAINT "task_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
