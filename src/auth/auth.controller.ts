import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response){
        const {email, password} = req.body
        const userData = await this.authService.login(email, password)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })
        return res.json(userData)
    }
    @Post('/registration')
    async registration(@Body() data: Prisma.UserCreateInput, @Res() res: Response, @Req() req: Request){
        const userData = await this.authService.registration(data)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })
        return res.json(userData)
    }
}
