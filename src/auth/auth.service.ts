import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { userDTO } from "src/user/dto/user-dto";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { TokenService } from "src/token/token.service";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  async signIn({ email, password }, res: Response): Promise<Response> {
    const actualUser = await this.validateUser(email, password); // проверка правильности логина и пароля
    const { tokens, user } = await this.generateAndSaveToken(actualUser);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  async signUp(res, data: CreateUserDto): Promise<string> {
    const candidate = await this.userService.getFirstUserByFilter({
      email: data.email,
    });

    if (candidate) {
      throw new HttpException(
        "This email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(data.password, 5); // хэширует пароль
    const createdUser = await this.userService.createUser({
      ...data,
      password: hashPassword,
    }); // получает созданного пользователя

    const { tokens, user } = await this.generateAndSaveToken(createdUser);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  private async validateUser(
    email: string,
    inputPassword: string
  ): Promise<userDTO> {
    if (!email && !inputPassword) {
      throw new HttpException(
        "email or password empty",
        HttpStatus.BAD_REQUEST
      );
    }

    const userData = await this.userService.getFirstUserByFilter({
      email: email,
    });

    if (!userData) {
      throw new ForbiddenException({
        message: "User with this email not exists",
      });
    }
    const { password, refreshtoken, ...user } = userData;
    const passwordEquals = await bcrypt.compare(inputPassword, password); // сравнивает пароли

    if (passwordEquals) {
      return user;
    }

    throw new ForbiddenException({
      message: "Incorrect password",
    });
  }

  async signOut(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException("You are not authorize");
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    const user = await this.tokenService.removeToken(refreshToken);

    return res.json(user);
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException("User not auth");
    }

    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException("User undefined", HttpStatus.UNAUTHORIZED);
    }

    const actualUser =
      await this.userService.getFirstUserByFilterWithOutPassword({
        id: userData.id,
      });
    const { tokens, user } = await this.generateAndSaveToken(actualUser);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  private async generateAndSaveToken(user: userDTO) {
    const tokens = this.tokenService.generateTokens(user); // генерируем два токена пользователю
    await this.tokenService.saveToken(user.id, tokens.refreshToken); // записываем токен в бд

    return { tokens: tokens, user };
  }
  private setCookies(res: Response, tokens) {
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.cookie("accessToken", tokens.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });

    return res;
  }
}
