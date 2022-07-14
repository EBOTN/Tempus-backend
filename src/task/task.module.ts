import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { ReportModule } from "src/report/report.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [ReportModule, AuthModule],
  exports: [],
})
export class TaskModule {}
