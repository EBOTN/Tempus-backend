import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/models/create-user-dto";
import { userDTO } from "src/models/user-dto";

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
    res.cookie("accessToken", userData.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData.user);
  }
  @Post("/registration")
  async registration(@Body() data: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.registration(data); // попытка зарегистрироваться
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("accessToken", userData.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData.user);
  }
  @Post("/logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.json(token);
  }
  @Get("/refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie("accessToken", userData.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData.user);
  }
}
