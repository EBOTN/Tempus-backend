import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { RequestMethod } from "@nestjs/common/enums";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "src/email/email.module";
import { TokenService } from "src/token/token.service";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthMiddleware } from "./AuthMiddlWare";

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
    EmailModule
  ],
  exports: [AuthService, JwtModule, TokenService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "auth/signOut", method: RequestMethod.POST });
  }
}
