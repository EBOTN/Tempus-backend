import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { ReadUserDto } from "src/user/dto/read-user-dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigUserWithoutPassword } from "./user.selecter.wpassword";
import { FilterUserQuery } from "./dto/filter-user-query";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<ReadUserDto> {
    try {
      return await this.prisma.user.create({
        data,
        select: new ConfigUserWithoutPassword(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException("User with this email already exists");
      }
    }
  }

  async delete(id: number): Promise<ReadUserDto> {
    try {
      return await this.prisma.user.delete({
        where: { id: id },
        select: new ConfigUserWithoutPassword(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
          throw new BadRequestException("User not exists");
      }
    }
  }

  async getByFilter(query: FilterUserQuery): Promise<ReadUserDto[]> {
    const { skip, take, taskId, searchText } = query;
    if (taskId) return this.getUsersFromTask(searchText, taskId, skip, take);
    return this.getAllUsers(searchText, skip, take);
  }

  async getAllUsers(searchText: string, skip: number, take: number) {
    return await this.prisma.user.findMany({
      where: {
        OR: {
          firstName: {
            contains: searchText || "",
            mode: "insensitive",
          },
          lastName: { contains: searchText || "", mode: "insensitive" },
        },
      },
      skip: skip,
      take: take,
      select: new ConfigUserWithoutPassword(),
    });
  }

  async getUsersFromTask(
    searchText: string,
    taskId: number,
    skip: number,
    take: number
  ) {
    return await this.prisma.user.findMany({
      where: {
        OR: {
          firstName: {
            contains: searchText || "",
            mode: "insensitive",
          },
          lastName: { contains: searchText || "", mode: "insensitive" },
        },
        assignedTasks: {
          some: { taskId: taskId },
        },
      },
      skip: skip,
      take: take,
      select: new ConfigUserWithoutPassword(),
      orderBy: {
        id: "asc",
      },
    });
  }

  async getFirstByFilter(filter): Promise<User> {
    if (!filter) throw new BadRequestException("Filter not specified");
    return await this.prisma.user.findFirst({
      where: filter,
    });
  }

  async gitFirstByRefreshToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException("You not auth");
    return await this.prisma.user.findFirst({
      where: {
        refreshtoken: refreshToken,
      },
    });
  }

  async update(id: number, newData): Promise<ReadUserDto> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { ...newData },
        select: new ConfigUserWithoutPassword(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("User not found");
        if (e.code === "P2002")
          throw new BadRequestException("You try change unique field");
      }
    }
  }
  async getFirstByFilterWithOutPassword(filters): Promise<ReadUserDto> {
    const userData = await this.prisma.user.findFirst({
      where: filters,
      select: new ConfigUserWithoutPassword(),
    });

    if (!userData) {
      throw new HttpException("User not exists", HttpStatus.BAD_REQUEST);
    }

    return userData;
  }
}
