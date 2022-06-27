import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/models/create-user-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { userDTO } from "src/models/user-dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login" })
  @ApiResponse({ status: 200, type: userDTO })
  @Post("/signIn")
  async signIn(@Req() req: Request, @Res() res: Response) {
    const userData = await this.authService.signIn(req.body); // попытка авторизоваться
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

  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 200, type: userDTO })
  @Post("/signUp")
  async signUp(@Body() data: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.signUp(data); // попытка зарегистрироваться
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

  @ApiOperation({ summary: "Logout" })
  @ApiResponse({ status: 200 })
  @Post("/signOut")
  async signOut(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    await this.authService.signOut(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.json();
  }

  @ApiOperation({ summary: "Refresh tokens" })
  @ApiResponse({ status: 200, type: userDTO })
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
