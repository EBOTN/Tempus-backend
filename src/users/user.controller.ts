import { Body, Get, Post } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserService } from "./user.service";

export class UserController{
    constructor(private userService: UserService){}

    @Post('user')
        create(@Body() userDTO: Prisma.UserCreateInput){
            return this.userService.createUser(userDTO);
        }
    @Get('users')
        getAll(){
            return this.userService.getAllUser();
        }
}