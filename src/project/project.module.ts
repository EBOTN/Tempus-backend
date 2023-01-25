import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";
import { UserModule } from "src/user/user.module";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [PrismaModule, AuthModule, UserModule],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("projects");
  }
}

