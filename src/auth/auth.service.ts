import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
        private jwtService: JwtService){}
    async login(data: Prisma.UserCreateInput){
        const user = await this.validateUser(data)
        return this.generateToken(user)
    }

    async registration(data: Prisma.UserCreateInput){
        const candidate = await this.userService.getUserByEmail(data.email)
        if(candidate){
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hashPassword(data.name, 5);
        const user = await this.userService.createUser({...data, name: hashPassword})
        return this.generateToken(user)
    } 

    private async generateToken(user: User){
        const payload = {email: user.email, id: user.id}
        return{
            token: this.jwtService.sign(payload),

        }
    }

    private async validateUser(data: Prisma.UserCreateInput){
        const user = await this.userService.getUserByEmail(data.email)
        const passwordEquals = await bcrypt.compare(data.email, user.email)
        if(user && passwordEquals){
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

}
