import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";
import { UserModule } from "src/user/user.module";
import { WorkspaceRoleGuard } from "src/shared/workspace-role-guard";
import { ProjectRoleGuard } from "src/shared/ProjectRoleGuard";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, WorkspaceRoleGuard, ProjectRoleGuard],
  imports: [PrismaModule, AuthModule, UserModule],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProjectController);
  }
}

