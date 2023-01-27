import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { UserDto } from "src/user/dto/user-dto";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { TokenService } from "src/token/token.service";
import { Request, Response } from "express";
import { ServerSideTokensDto } from "./dto/server-side-tokens.dto";

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
    const hashPassword = await this.hashPassword(data.password); // хэширует пароль
    const createdUser = await this.userService.create({
      ...data,
      password: hashPassword,
    }); // получает созданного пользователя

    const { tokens, user } = await this.generateAndSaveToken(createdUser);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  async isPasswordCorrect(
    inputPassword: string,
    password: string
  ): Promise<boolean> {
    const returnedData = bcrypt.compare(inputPassword, password);
    return returnedData;
  }

  async hashPassword(password: string): Promise<string> {
    const returnedData = await bcrypt.hash(password, 5);
    return returnedData
  }

  private async validateUser(
    email: string,
    inputPassword: string
  ): Promise<UserDto> {
    if (!email && !inputPassword) {
      throw new HttpException(
        "email or password empty",
        HttpStatus.BAD_REQUEST
      );
    }

    const userData = await this.userService.getFirstByFilter({
      email: email,
    });

    if (!userData) {
      throw new BadRequestException({
        message: "User with this email not exists",
      });
    }
    const { password, refreshtoken, ...user } = userData;
    const passwordEquals = await this.isPasswordCorrect(
      inputPassword,
      password
    ); // сравнивает пароли

    if (passwordEquals) {
      return user;
    }

    throw new BadRequestException({
      message: "Incorrect password",
    });
  }

  async signOut(req: Request, res: Response): Promise<Response> {
    const { refreshToken } = req.cookies;
    const user = await this.tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

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
      throw new UnauthorizedException("User undefined");
    }

    const currentUser = await this.userService.getFirstByFilterWithOutPassword({
      id: userData.id,
    });
    const { tokens, user } = await this.generateAndSaveToken(currentUser);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  async refreshServerSide(refreshToken: string): Promise<ServerSideTokensDto> {
    if (!refreshToken) {
      throw new UnauthorizedException("User not auth");
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException("User undefined");
    }
    const currentUser = await this.userService.getFirstByFilterWithOutPassword({
      id: userData.id,
    });
    const { tokens } = await this.generateAndSaveToken(currentUser);

    const returnedData = {
      accessToken: { token: tokens.accessToken, maxAge: 15 * 60 * 1000 },
      refreshToken: {
        token: tokens.refreshToken,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    };

    return returnedData;
  }

  private async generateAndSaveToken(user: UserDto) {
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
