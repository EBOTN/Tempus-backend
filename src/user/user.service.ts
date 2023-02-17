import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { CreateUserDto } from "src/user/dto/create-user-dto";
import { UserDto } from "src/user/dto/user-dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigUserWithoutPassword } from "./user.selecter.wpassword";
import { FilterUserQuery } from "./dto/filter-user-query";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "src/auth/auth.service";
import { ChangeUserPasswordDto } from "./dto/change-user-password.dto";
import { FileService } from "src/file/file.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private fileService: FileService
  ) {}

  async create(data: CreateUserDto): Promise<UserDto> {
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

  async delete(id: number): Promise<UserDto> {
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

  async getByFilter(query: FilterUserQuery): Promise<UserDto[]> {
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
  ): Promise<UserDto[]> {
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
  async getById(id: number, isExtended?: boolean): Promise<User | UserDto> {
    const returnedData = await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: isExtended
        ? {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            refreshtoken: true,
          }
        : new ConfigUserWithoutPassword(),
    });
    return returnedData;
  }
  async getByEmail(
    email: string,
    isExtended?: boolean
  ): Promise<User | UserDto> {
    const returnedData = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: isExtended
        ? {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            refreshtoken: true,
          }
        : new ConfigUserWithoutPassword(),
    });
    return returnedData;
  }

  async getByRefreshToken(
    refreshToken: string,
    isExtended?: boolean
  ): Promise<User | UserDto> {
    return await this.prisma.user.findFirst({
      where: {
        refreshtoken: refreshToken,
      },
      select: isExtended
        ? {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            refreshtoken: true,
          }
        : new ConfigUserWithoutPassword(),
    });
  }

  async refreshToken(id: number, refreshToken: string): Promise<UserDto> {
    const returnedData = await this.prisma.user.update({
      where: { id },
      data: { refreshtoken: refreshToken },
      select: new ConfigUserWithoutPassword(),
    });
    return returnedData;
  }

  async update(id: number, newData: UpdateUserDto): Promise<UserDto> {
    try {
      const coverUrl = await this.fileService.createFile(newData.avatarFile);
      const { avatarFile, ...data } = newData;
      return await this.prisma.user.update({
        where: { id },
        data: { ...data, avatar: coverUrl || undefined },
        select: new ConfigUserWithoutPassword(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("User not found");
        if (e.code === "P2002")
          throw new BadRequestException("This email already exists");
      }
    }
  }

  async changePassword(
    id: number,
    changeUserPasswordDto: ChangeUserPasswordDto
  ): Promise<UserDto> {
    const currentUser = (await this.getById(id, true)) as User;
    const passwordEquals = await this.authService.isPasswordCorrect(
      changeUserPasswordDto.currentPassword,
      currentUser.password
    );
    if (!passwordEquals) throw new BadRequestException("Password incorrect!");
    const hashPassword = await this.authService.hashPassword(
      changeUserPasswordDto.newPassword
    );

    try {
      const returnedData = await this.prisma.user.update({
        where: { id },
        data: { password: hashPassword },
      });

      return returnedData;
    } catch (e) {}
  }
}
