import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { CreateUserDto } from "src/models/create-user-dto";
import { userDTO } from "src/models/user-dto";
import { PrismaService } from "src/prisma.service";
import { ConfigUserWithoutPassword } from "./user.selecter.wpassword";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<userDTO> {
    return await this.prisma.user.create({
      data,
      select: new ConfigUserWithoutPassword(),
    });
  }

  async getUsersByFilter(filter): Promise<User[]> {
    return await this.prisma.user.findMany({ where: filter });
  }

  getAllUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // TODO: Add validation if user not exist | ? Конфликт с регистрацией
  async getFirstUserByFilter(filter): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: filter,
    });
    // if (!user)
    //   throw new HttpException("User not exists", HttpStatus.BAD_REQUEST);
    return user;
  }

  // TODO: Add validation if user not exist | +
  async updateUser(id: number, newData): Promise<userDTO> {
    if (!id) {
      throw new HttpException("User not exists", HttpStatus.BAD_REQUEST);
    }
    if (!newData) {
      throw new HttpException("Missing changes", HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.user.update({
      where: { id },
      data: { ...newData },
      select: new ConfigUserWithoutPassword(),
    });
  }

  async getFirstUserByFilterWithOutPassword(filters) {
    const userData = await this.prisma.user.findFirst({
      where: filters,
      select: new ConfigUserWithoutPassword(),
    });

    if (!userData) {
      throw new HttpException("User not exists", HttpStatus.BAD_REQUEST);
    }

    return userData;
  }

  async getFirstUserByFilterExcludeSelecters({ filters, selecters }) {
    const user = await this.prisma.user.findFirst({
      where: filters,
      select: selecters,
    });

    return user;
  }
}
