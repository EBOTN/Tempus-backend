import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { TaskDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllByUserId(userId: number) {
    try {
      return this.prisma.assignedTask.findMany({
        where: {
          workerId: userId,
        },
        select: {
          task: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          startTime: true,
          endTime: true,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async create(data: CreateTaskDto): Promise<TaskDto> {
    try {
      return await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          creatorId: data.creatorId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Incorrect creator or worker");
        if (e.code === "P2003")
          throw new BadRequestException("Incorrect worker");
        if (e.code === "P2002")
          throw new BadRequestException("User already assigned to this task");
      }
    }
  }

  async remove(param: UpdateTaskParam): Promise<TaskDto> {
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

  async update(param: UpdateTaskParam, data: UpdateTaskDto): Promise<TaskDto> {
    try {
      if (data.removedWorkers) {
        await this.removeUsersFromTaskById(param.id, data.removedWorkers);
      }
      if (data.addedWorkers) {
        await this.assignUsersToTaskById(param.id, data.addedWorkers);
      }
      const { addedWorkers, removedWorkers, ...updateTask } = data;
      return await this.prisma.task.update({
        where: param,
        data: updateTask,
        select: {
          id: true,
          title: true,
          description: true,
          creatorId: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2003")
          throw new BadRequestException("Incorrect worker");
        if (e.code === "P2002")
          throw new BadRequestException("User already assigned to this task");
      }
    }
  }

  async getAllUsersByTaskId(taskId: number) {
    return await this.prisma.assignedTask.findMany({
      where: { taskId: taskId },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async removeUsersFromTaskById(taskId: number, users: number[]) {
    await this.prisma.assignedTask.deleteMany({
      where: { workerId: { in: users }, taskId: taskId },
    });
  }

  async assignUsersToTaskById(taskId: number, users: number[]) {
    await this.prisma.assignedTask.createMany({
      data: users.map((id) => ({ workerId: id, taskId: taskId })),
    });
  }

  async deleteById(id: number) {
    return await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }
}
