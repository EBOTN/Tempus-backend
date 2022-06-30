import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { userDTO } from "src/user/dto/user-dto";
import { AuthUserDto } from "./dto/auth-user-dto";
import { JwtAuthGuard } from "./jwt-auth-guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login" })
  @ApiResponse({ status: 200, type: userDTO })
  @Post("/signIn")
  async signIn(@Body() data: AuthUserDto, @Res() res: Response) {
    return await this.authService.signIn(data, res);
  }

  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 200, type: userDTO })
  @Post("/signUp")
  async signUp(@Body() data: CreateUserDto, @Res() res: Response) {
    return await this.authService.signUp(res, data); // попытка зарегистрироваться
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Logout" })
  @ApiResponse({ status: 200 })
  @Post("/signOut")
  async signOut(@Req() req: Request, @Res() res: Response) {
    return await this.authService.signOut(req, res);
  }

  @ApiOperation({ summary: "Refresh tokens" })
  @ApiResponse({ status: 200, type: userDTO })
  @Get("/refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    return await this.authService.refresh(req, res);
  }
}
