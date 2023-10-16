import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ExtendedRequest } from "src/shared/extended-request";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private tokenService: TokenService
  ) {}

  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
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

      req.userInfo = { id: tokenUser.id };

      next();
    } catch (e) {
      throw new UnauthorizedException("User not auth");
    }
  }
}
