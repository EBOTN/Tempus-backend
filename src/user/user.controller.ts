import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { CreateUserDto } from "src/models/create-user-dto";
import { userDTO } from "src/models/user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all users", description: "Need authorization" })
  @ApiResponse({ status: 200, type: [userDTO] })
  @Get()
  async getAll() {
    return await this.userService.getAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({ status: 200, type: userDTO })
  @Get("/currentUser")
  async getCurrentUser(@Req() req: Request) {
    const { accessToken } = req.cookies;
    const userDto = await this.tokenService.validateAccessToken(accessToken);
    const user = await this.userService.getFirstUserByFilterWithOutPassword({
      id: userDto.id,
    });
    return user;
  }
}
