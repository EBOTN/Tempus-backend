import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { User } from "@prisma/client";
import { EmailService } from "src/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
    private mailService: EmailService
  ) {}

  checkRecoveryToken(token: string, res: Response): Response {
    const email = this.tokenService.validateRecoveryToken(token);
    if (email) return res.status(200).send();
    throw new HttpException("Not found", HttpStatus.NOT_FOUND);
  }

  async recoveryPassword(token: string, newPassword: string): Promise<UserDto> {
    const email = await this.tokenService.validateRecoveryToken(token);
    if (!email) throw new BadRequestException("Token not valid");
    const hashPassword = await this.hashPassword(newPassword);
    const user = await this.userService.getByEmail(email);
    return await this.userService.update(user.id, { password: hashPassword });
  }

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
    const salt = await bcrypt.genSalt();
    const returnedData = await bcrypt.hash(password, salt);
    return returnedData;
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

    const userData = (await this.userService.getByEmail(email, true)) as User;

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

  async signOut(req: Request, res: Response): Promise<Response<UserDto>> {
    const { refreshToken } = req.cookies;
    const user = await this.tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.json(user);
  }

  async refresh(req: Request, res: Response): Promise<Response<UserDto>> {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException("User not auth");
    }

    const tokenData = await this.tokenService.validateRefreshToken(
      refreshToken
    );
    const userFromDb = (await this.userService.getByRefreshToken(
      refreshToken
    )) as UserDto;

    if (!tokenData || !userFromDb) {
      throw new UnauthorizedException("User undefined");
    }

    const { tokens, user } = await this.generateAndSaveToken(userFromDb);
    res = this.setCookies(res, tokens);

    return res.json(user);
  }

  async refreshServerSide(refreshToken: string): Promise<ServerSideTokensDto> {
    if (!refreshToken) {
      throw new UnauthorizedException("User not auth");
    }
    const tokenData = await this.tokenService.validateRefreshToken(
      refreshToken
    );
    const userFromDb = (await this.userService.getByRefreshToken(
      refreshToken
    )) as UserDto;

    if (!tokenData || !userFromDb) {
      throw new UnauthorizedException("User undefined");
    }

    const { tokens } = await this.generateAndSaveToken(userFromDb);

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

  async forgetPassword(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new BadRequestException("User not exists");
    const token = this.tokenService.generateRecoveryPasswordToken({ email });
    return await this.mailService.sendPasswordRecovery(
      email,
      user.firstName,
      token
    );
  }
}
