import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TokenService } from "src/token/token.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  async use(req, res: Response, next: NextFunction) {
    try {
      const { accessToken } = req.cookies;
      if (!accessToken) {
        throw new UnauthorizedException("User not have AT");
      }
      const tokenUser = await this.tokenService.validateAccessToken(
        accessToken
      );

      if (!tokenUser) {
        throw new UnauthorizedException("User have invalid AT");
      }
      const user = await this.userService.getFirstByFilter({
        id: tokenUser.id,
      });

      if (user) {
        req.userInfo = { userId: user.id };

        next();
      } else {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        throw new UnauthorizedException("User not auth");
      }
    } catch (e) {
      throw new UnauthorizedException("User not auth");
    }
  }
}
