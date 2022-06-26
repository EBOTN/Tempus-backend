import { Body, Controller, Get, Options, Post } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateUserDto } from "src/models/create-user-dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return await this.userService.getAllUser();
  }

  @Post()
  async create(@Body() userDTO: CreateUserDto) {
    return await this.userService.createUser(userDTO);
  }
}
