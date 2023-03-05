import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "src/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthMiddleware } from "src/auth/AuthMiddlWare";
import { NestjsFormDataModule } from "nestjs-form-data";
import { FileModule } from "src/file/file.module";
import { TokenService } from "src/token/token.service";

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    PrismaModule,
    NestjsFormDataModule,
    FileModule,
  ],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes("user");
  }
}
