import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ReadTaskQuery } from "./dto/read-task-query";
import { SelectAssignedTask } from "./dto/select-assigned-task-dto";
import { TaskDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAssignedTasksByUserId(query: ReadTaskQuery) {
    const { userId } = query;
    try {
      const data = await this.prisma.assignedTask.findMany({
        where: {
          workerId: userId,
        },
        select: {
          task: {
            select: {
              title: true,
              description: true,
              creatorId: true,
            },
          },
          ...new SelectAssignedTask(),
        },
      });
      return data.map((item) => {
        const _ = { ...item.task };
        delete item.task;
        return { ..._, ...item };
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getCreatedTasksByUserId(query: ReadTaskQuery) {
    const { title, userId } = query;
    try {
      return this.prisma.task.findMany({
        where: {
          title: {
            startsWith: title,
          },
          creatorId: userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          creatorId: true,
          workers: true,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getAll() {
    return await this.prisma.task.findMany();
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
      return await this.prisma.task.update({
        where: param,
        data: data,
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
      }
    }
  }

  async removeUsersFromTaskById(taskId: number, userId: number) {
    try {
      return await this.prisma.assignedTask.delete({
        where: {
          taskid: {
            workerId: userId,
            taskId: taskId,
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2003")
          throw new BadRequestException("Incorrect worker");
      }
    }
  }

  async assignUsersToTaskById(taskId: number, userId: number) {
    try {
      return await this.prisma.assignedTask.create({
        data: {
          taskId: taskId,
          workerId: userId,
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

  async deleteById(id: number) {
    return await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  async startTask(id: number) {
    const date = new Date();
    const task = await this.getFirstAssignedTaskByFilter({
      id: id,
    });
    if (task.isComplete) throw new BadRequestException("Task already finished");
    if (task.isStarted) throw new BadRequestException("Task already start");
    try {
      const data = await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          startTime: date,
          isStarted: true,
        },
        select: {
          task: {
            select: {
              title: true,
              description: true,
              creatorId: true,
            },
          },
          ...new SelectAssignedTask(),
        },
      });
      const { task: taskData, ...taskInfo } = data;
      return { ...taskData, ...taskInfo };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async finishTask(id: number) {
    const date = new Date();
    const task = await this.getFirstAssignedTaskByFilter({
      id: id,
    });
    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");
    if (task.isPaused) throw new BadRequestException("Task on pause!");
    const workTIme = date.getTime() - task.startTime.getTime() - task.pauseTime;
    try {
      const data = await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          endTime: date,
          isComplete: true,
          workTime: workTIme,
        },
        select: {
          task: {
            select: {
              title: true,
              description: true,
              creatorId: true,
            },
          },
          ...new SelectAssignedTask(),
        },
      });
      const { task: taskData, ...taskInfo } = data;
      return { ...taskData, ...taskInfo };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async startPause(id: number) {
    const task = await this.getFirstAssignedTaskByFilter({ id: id });
    if (task.isPaused) throw new BadRequestException("Task already paused");
    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");
    try {
      const date = new Date();
      const data = await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          startPauseTime: date,
          isPaused: true,
        },
        select: {
          task: {
            select: {
              title: true,
              description: true,
              creatorId: true,
            },
          },
          ...new SelectAssignedTask(),
        },
      });
      const { task: taskData, ...taskInfo } = data;
      return { ...taskData, ...taskInfo };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async endPause(id: number) {
    const task = await this.getFirstAssignedTaskByFilter({ id: id });
    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");
    if (!task.isPaused) throw new BadRequestException("Task not paused");

    try {
      const date = new Date();
      let pauseTime = date.getTime() - task.startPauseTime.getTime();
      if (task.pauseTime) {
        pauseTime += task.pauseTime;
      }

      const data = await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          pauseTime: pauseTime,
          isPaused: false,
          endPauseTime: date,
          startPauseTime: null,
        },
        select: {
          task: {
            select: {
              title: true,
              description: true,
              creatorId: true,
            },
          },
          ...new SelectAssignedTask(),
        },
      });
      const { task: taskData, ...taskInfo } = data;
      return { ...taskData, ...taskInfo };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  private async getFirstAssignedTaskByFilter(filter) {
    const data = await this.prisma.assignedTask.findFirst({
      where: filter,
    });
    if (!data) throw new BadRequestException("Task not exists");
    return data;
  }
}
