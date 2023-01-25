import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ReadUserDto } from "src/user/dto/read-user-dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  generateTokens(payload: ReadUserDto) {
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

  async saveToken(id: number, refreshtoken: string): Promise<ReadUserDto> {
    return this.userService.update(id, { refreshtoken }); // записывает пользователю RT
  }

  async removeToken(refreshToken: string): Promise<ReadUserDto> {
    const user = await this.validateRefreshToken(refreshToken);
    if (!user) throw new BadRequestException();

    return await this.userService.update(user.id, { refreshtoken: null });
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

  validateRefreshToken(token: string): Promise<ReadUserDto> {
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

  async findToken(refreshToken: string): Promise<string> {
    const user = await this.userService.gitFirstByRefreshToken(
      refreshToken
    );
    if (user) {
      return user.refreshtoken;
    }
    return null;
  }
}
