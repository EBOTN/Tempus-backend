import { Body, Controller, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/login')
    login(@Body() data: Prisma.UserCreateInput){
        return this.authService.login(data)
    }
    @Post('/registration')
    registration(@Body() data: Prisma.UserCreateInput){
        return this.authService.registration(data)
    }
}
