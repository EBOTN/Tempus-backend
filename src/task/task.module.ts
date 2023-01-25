import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { ReportModule } from "src/report/report.module";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [ReportModule, AuthModule],
  exports: [],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("tasks");
  }
}

