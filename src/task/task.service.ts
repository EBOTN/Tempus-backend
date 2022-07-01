import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { ConfigUserWithoutPassword } from "src/user/user.selecter.wpassword";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ReadTaskQuery } from "./dto/read-task-query";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllByUserId(query: ReadTaskQuery) {
    try {
      return this.prisma.task.findMany({
        where: {
          workerId: query.userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          User_Task_creatorIdToUser: {
            select: new ConfigUserWithoutPassword(),
          },
          User_Task_workerIdToUser: {
            select: new ConfigUserWithoutPassword(),
          },
        },
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }
  async create(data: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          User_Task_creatorIdToUser: {
            connect: {
              id: data.creatorId,
            },
          },
          User_Task_workerIdToUser: {
            connect: {
              id: data.workerId,
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Incorrect creator or worker");
      }
    }
  }

  async remove(param: UpdateTaskParam) {
    try {
      return await this.prisma.task.delete({
        where: param,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async update(param: UpdateTaskParam, data: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: param,
        data: data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
        if (e.code === "P2003")
          throw new BadRequestException("Worker not exists");
      }
    }
  }
}
