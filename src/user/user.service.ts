import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
          data,
        });
      }
      
    async getAllUser(){
        return this.prisma.user.findMany();
    }
}
