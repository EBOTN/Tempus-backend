import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/models/create-user-dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  async login(@Req() req: Request, @Res() res: Response) {
    const userData = await this.authService.login(req.body); // попытка авторизоваться
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  }
  @Post("/registration")
  async registration(@Body() data: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.registration(data); // попытка зарегистрироваться
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  }
  @Post("/logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  }
}
