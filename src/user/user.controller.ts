import { Body, Controller, Get, Options, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    async getAll(){
        return await this.userService.getAllUser()
    }

    @Post()
    async create(@Body() userDTO: Prisma.UserCreateInput){
        return await this.userService.createUser(userDTO);
    }
    
}