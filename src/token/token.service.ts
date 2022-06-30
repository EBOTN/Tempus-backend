import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userDTO } from "src/user/dto/user-dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  generateTokens(payload: userDTO) {
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

  async saveToken(id: number, refreshtoken: string): Promise<userDTO> {
    if (!id || !refreshtoken) {
      throw new BadRequestException();
    }

    return this.userService.updateUser(id, { refreshtoken }); // записывает пользователю RT
  }

  async removeToken(refreshToken: string): Promise<userDTO> {
    if (!refreshToken) {
      throw new BadRequestException();
    }
    
    const { id } = await this.userService.getFirstUserByFilter({
      refreshtoken: refreshToken,
    });

    if (!id) {
      throw new BadRequestException();
    }

    return await this.userService.updateUser(id, { refreshtoken: null });
  }

  validateAccessToken(token: string): Promise<userDTO> {
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

  validateRefreshToken(token: string): Promise<userDTO> {
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
    const { refreshtoken, ...user } =
      await this.userService.getFirstUserByFilter({
        refreshtoken: refreshToken,
      });
    if (user) {
      return refreshtoken;
    }
    return null;
  }
}
