import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDto } from "src/user/dto/user-dto";
import { AuthUserDto } from "./dto/auth-user-dto";
import { ServerSideTokensDto } from "./dto/server-side-tokens.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login" })
  @ApiResponse({ status: 200, type: UserDto })
  @Post("/signIn")
  async signIn(@Body() data: AuthUserDto, @Res() res: Response) {
    return await this.authService.signIn(data, res);
  }

  @ApiOperation({ summary: "Create new user" })
  @ApiResponse({ status: 200, type: UserDto })
  @Post("/signUp")
  async signUp(@Body() data: CreateUserDto, @Res() res: Response) {
    return await this.authService.signUp(res, data); // попытка зарегистрироваться
  }

  @ApiOperation({ summary: "Logout" })
  @ApiResponse({ status: 200 })
  @Post("/signOut")
  async signOut(@Req() req: Request, @Res() res: Response) {
    return await this.authService.signOut(req, res);
  }

  @ApiOperation({ summary: "Refresh tokens" })
  @ApiResponse({ status: 200, type: UserDto })
  @Get("/refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    return await this.authService.refresh(req, res);
  }
  
  @ApiOperation({ summary: "Refresh tokens for server side" })
  @ApiResponse({ status: 200, type: ServerSideTokensDto })
  @Post("/refresh-server-side")
  async refreshServerSide(@Body("refreshToken") refreshToken: string) {
    return await this.authService.refreshServerSide(refreshToken);
  }
}
