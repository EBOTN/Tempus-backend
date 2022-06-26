import { Body, Controller, Get, Options, Post, Req, Res, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { CreateUserDto } from "src/models/create-user-dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return await this.userService.getAllUser();
  }

  @Post()
  async create(@Body() userDTO: CreateUserDto) {
    return await this.userService.createUser(userDTO);
  }

  
}
