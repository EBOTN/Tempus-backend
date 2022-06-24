import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({
          data,
        });
      }
      
    async getAllUser(){
        return await this.prisma.user.findMany();
    }
    async getUserByEmail(email: string){
        const user = await this.prisma.user.findFirst({where: {email}})
        return user;
    }
    async getUserById(id: number){
      const user = await this.prisma.user.findFirst({where: {id}})
      return user
    }
    async updateUser(id: number, newUser){
          const student = await this.prisma.user.findFirst({where:{id}})
          return await this.prisma.user.update({where: {id},
            data:{
              ...newUser
          }});
  }
}
