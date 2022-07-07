-- DropForeignKey
ALTER TABLE "TimeLines" DROP CONSTRAINT "nasjk";

-- AddForeignKey
ALTER TABLE "TimeLines" ADD CONSTRAINT "nasjk" FOREIGN KEY ("taskId") REFERENCES "AssignedTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
