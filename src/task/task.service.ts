import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { ConfigUserWithoutPassword } from "src/user/user.selecter.wpassword";
import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAllTasksByUserId(id: number) {
    if (!id) {
      throw new BadRequestException();
    }
    return this.prisma.task.findMany({
      where: {
        workerId: id,
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
  }

  async createTask(data: CreateTaskDto) {
    try{
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
    }catch(e){
      throw new BadRequestException()
    }
    
  }

  async removeTask(id: number) {
    if (!id) throw new BadRequestException();
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async update(id: number, data: UpdateTaskDto) {
    if (!id || !data) throw new BadRequestException();
    try {
      return await this.prisma.task.update({
        where: { id },
        data: data,
      });
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
