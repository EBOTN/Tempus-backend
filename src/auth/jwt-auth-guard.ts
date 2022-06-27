import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenService } from "src/token/token.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const { accessToken } = req.cookies;
      const userData = this.tokenService.validateAccessToken(accessToken);
      if (!accessToken || !userData) {
        throw new UnauthorizedException({ message: "User not auth" });
      }
      req.user = userData;
      return true;
    } catch (e) {
      throw new UnauthorizedException({ message: "User not auth" });
    }
  }
}
