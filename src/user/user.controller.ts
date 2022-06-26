import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { CreateUserDto } from "src/models/create-user-dto";
import { TokenService } from "src/token/token.service";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.userService.getAllUser();
  }

  @Post()
  async create(@Body() userDTO: CreateUserDto) {
    return await this.userService.createUser(userDTO);
  }
  @Get("gay")
  async getUserByAT(@Req() req: Request) {
    const { accessToken } = req.cookies;
    const userDto = await this.tokenService.validateAccessToken(accessToken);
    const user = await this.userService.getFirstUserByFilterWithOutPassword({
      id: userDto.id,
    });
    return user;
  }
}
