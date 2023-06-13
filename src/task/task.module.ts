import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";
import { UserModule } from "src/user/user.module";
import { PrismaService } from "src/prisma/prisma.service";
import { TimeLineModule } from "src/time-line/time-line.module";

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  imports: [AuthModule, UserModule, TimeLineModule],
  exports: [TimeLineModule],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TaskController);
  }
}
