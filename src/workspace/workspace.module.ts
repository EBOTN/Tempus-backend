import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceController } from "./workspace.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";
import { UserModule } from "src/user/user.module";
import { FileModule } from "src/file/file.module";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [PrismaModule, AuthModule, UserModule, FileModule, NestjsFormDataModule],
})
export class WorkspaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("workspace");
  }
}
