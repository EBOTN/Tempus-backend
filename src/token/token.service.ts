import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/user-dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  validateRecoveryToken(token: string): Promise<string> {
    try {
      const { email } = this.jwtService.verify(token, {
        secret: process.env.JWT_RECOVERY_PASS_SECRET,
      });
      return email;
    } catch (e) {
      return null;
    }
  }

  generateTokens(payload: UserDto) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      secret: process.env.JWT_ACCESS_SECRET,
    }); // AT живет 15 минут
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
      secret: process.env.JWT_REFRESH_SECRET,
    }); // RT живет 7 дней
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  generateRecoveryPasswordToken(payload: { email: string }) {
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_RECOVERY_PASS_EXPIRES_IN || "15m",
      secret: process.env.JWT_RECOVERY_PASS_SECRET,
    });
    return token;
  }

  async saveToken(id: number, refreshtoken: string): Promise<UserDto> {
    return this.userService.refreshToken(id, refreshtoken); // записывает пользователю RT
  }

  async removeToken(refreshToken: string): Promise<UserDto> {
    const user = await this.validateRefreshToken(refreshToken);
    if (!user) throw new BadRequestException();

    return await this.userService.refreshToken(user.id, null);
  }

  validateAccessToken(token: string) {
    if (!token)
      throw new UnauthorizedException({ message: "User unauthorized" });

    try {
      const { iat, exp, ...userData } = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): Promise<UserDto> {
    if (!token)
      throw new UnauthorizedException({ message: "User unauthorized" });

    try {
      const { iat, exp, ...userData } = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  // async findToken(refreshToken: string): Promise<string> {
  //   const user = await this.userService.gitFirstByRefreshToken(refreshToken);
  //   if (user) {
  //     return user.refreshtoken;
  //   }
  //   return null;
  // }
}
