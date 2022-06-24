import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { userDTO } from 'src/models/user-dto';

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
        private jwtService: JwtService){}

    async login(email, password){
        const user = await this.validateUser(email, password)
        const userdto = new userDTO(user)
        const tokens = await this.generateTokens({...userdto})
        await this.saveToken(userdto.id, (await tokens).refreshToken)
        return {...tokens, user: userdto}
    }

    async registration(data: Prisma.UserCreateInput){
        const candidate = await this.userService.getUserByEmail(data.email)
        if(candidate){
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(data.password, 5);
        const user = await this.userService.createUser({...data, password: hashPassword})
        const userdto = new userDTO(user)
        const tokens = this.generateTokens({...userdto})
        await this.saveToken(userdto.id, (await tokens).refreshToken)
        return {...tokens, user: userdto}
    } 

    private async generateTokens(payload){
        const accessToken = this.jwtService.sign(payload, {expiresIn:'30m'})
        const refreshToken = this.jwtService.sign(payload, {expiresIn:'7d'})
        return{
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async saveToken(id: number, refreshtoken: string) {
        const user = this.userService.getUserById(id)
        if(user){
            return this.userService.updateUser(id, {...user, refreshtoken: refreshtoken})
        }
      }

    private async validateUser(email, password){
        const user = await this.userService.getUserByEmail(email)
        const passwordEquals = await bcrypt.compare(password, user.password)
        if(user && passwordEquals){
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }
}
