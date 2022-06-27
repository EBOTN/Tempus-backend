import { HttpException, HttpStatus, Injectable, NotImplementedException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async generateTokens(payload) {
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

  async saveToken(id: number, refreshtoken: string) {
    const user = await this.userService.getFirstUserByFilter({ id: id }); // ищет пользователя по id
    if (user) {
      return this.userService.updateUser(
        { id: id },
        {
          ...user,
          refreshtoken: refreshtoken,
        }
      ); // записывает пользователю RT
    }
  }

  async removeToken(refreshToken) {
    const user = await this.userService.getFirstUserByFilter({
      refreshtoken: refreshToken,
    });
    const token = (
      await this.userService.updateUser({ refreshtoken: refreshToken }, user)
    ).refreshtoken;
    return token;
  }
  validateAccessToken(token) {
    if(!token)
    throw new UnauthorizedException({message: "User unauthorized"})
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      return userData;
    } catch (e) {
      return null
    }
  }
  validateRefreshToken(token) {
    if(!token)
    throw new UnauthorizedException({message: "User unauthorized"})
    try {
      const userData = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return userData;
    } catch (e) {
      return null
    }
  }
  async findToken(refreshToken) {
    const user = await this.userService.getFirstUserByFilter({
      refreshtoken: refreshToken,
    });
    if(user){
      return user.refreshtoken;
    }
    return null;
  }
}
