import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenService } from "src/token/token.service";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [
    forwardRef(()=>UserModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET",
      signOptions: {
        expiresIn: "24h",
      },
    }),
  ],
  exports:[
    AuthService,
    JwtModule,
    TokenService
  ]
})
export class AuthModule {}
