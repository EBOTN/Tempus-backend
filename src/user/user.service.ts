import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserDto } from "src/models/create-user-dto";
import { userDTO } from "src/models/user-dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async getUsersByFilter(filter) {
    const users = await this.prisma.user.findMany({ where: filter });
    return users;
  }

  async getAllUser() {
    return await this.prisma.user.findMany();
  }

  async getFirstUserByFilter(filter) {
    const user = await this.prisma.user.findFirst({ where: filter });
    return user;
  }

  async updateUser(filter, newUser) {
    const user = await this.getFirstUserByFilter(filter);
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...newUser,
      },
    });
  }

  async getFirstUserByFilterWithOutPassword(filter) {
    const userData = await this.prisma.user.findFirst({ where: filter });
    const user = new userDTO(userData);
    return user;
  }
}
