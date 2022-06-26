import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { userDTO } from "src/models/user-dto";
import { CreateUserDto } from "src/models/create-user-dto";
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async login({ email, password }) {
    const user = await this.validateUser(email, password); // проверка правильности логина и пароля
    const userdata = await this.generateAndSaveToken(user);
    return { ...userdata.tokens, user: userdata.userdto };
  }

  async registration(data: CreateUserDto) {
    const candidate = await this.userService.getFirstUserByFilter({
      email: data.email,
    });
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email уже существует",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(data.password, 5); // хэширует пароль
    const user = await this.userService.createUser({
      ...data,
      password: hashPassword,
    }); // получает созданного пользователя
    const userdata = await this.generateAndSaveToken(user);
    return { ...userdata.tokens, user: userdata.userdto };
  }

  private async validateUser(email, password) {
    if (!email && !password) {
      throw new HttpException("email или пароль пусты", HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getFirstUserByFilter({ email: email });
    if (!user) {
      throw new UnauthorizedException({
        message: "Пользователь с таким email адресом не найден",
      });
    }
    const passwordEquals = await bcrypt.compare(password, user.password); // сравнивает пароли
    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "Некорректный email или пароль",
    });
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException("Ошибка, вы не авторизованы");
    }
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException("User not auth");
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getFirstUserByFilter({ id: userData.id });
    const userdata = await this.generateAndSaveToken(user);
    return { ...userdata.tokens, user: userdata.userdto };
  }
  private async generateAndSaveToken(user) {
    const userdto = new userDTO(user);
    const tokens = await this.tokenService.generateTokens({ ...userdto }); // генерируем два токена пользователю
    await this.tokenService.saveToken(userdto.id, tokens.refreshToken); // записываем токен в бд
    return { tokens: tokens, userdto };
  }
}
