import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { AuthModule } from "src/auth/auth.module";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  imports: [AuthModule]
})
export class TaskModule {}
