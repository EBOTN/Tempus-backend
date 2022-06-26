import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async generateTokens(payload) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: "30m" }); // AT живет 30 минут
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" }); // RT живет 7 дней
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async saveToken(id: number, refreshtoken: string) {
    const user = await this.userService.getFirstUserByFilter({ id: id }); // ищет пользователя по id
    if (user) {
      return this.userService.updateUser({id: id}, {
        ...user,
        refreshtoken: refreshtoken,
      }); // записывает пользователю RT
    }
  }

  async removeToken(refreshToken) {
    const user = await this.userService.getFirstUserByFilter({
      refreshtoken: refreshToken,
    });
    const token = (await this.userService.updateUser({refreshtoken: refreshToken}, user))
      .refreshtoken;
    return token;
  }
}
