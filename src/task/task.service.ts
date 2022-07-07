import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { AssignedTaskInfoDto } from "./dto/assigned_task-info-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ReadTaskQuery } from "./dto/read-task-query";
import { SelectAssignedTask } from "./dto/select-assigned-task-dto";
import { TaskDto } from "./dto/task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getAssignedTasksByUserId(userId: number) {
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
        orderBy: {
          id: "asc",
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

  async getFirst(taskId: number): Promise<TaskDto> {
    return await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        creatorId: true,
        workers: {
          select: new SelectAssignedTask(),
        },
      },
    });
  }

  async getCreatedTasksByUserId(query: ReadTaskQuery): Promise<TaskDto[]> {
    const { title, userId } = query;
    try {
      return this.prisma.task.findMany({
        where: {
          title: {
            contains: title || "",
            mode: "insensitive",
          },
          creatorId: userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          creatorId: true,
          workers: {
            select: new SelectAssignedTask(),
          },
        },
        orderBy: {
          id: "asc",
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getAll(): Promise<TaskDto[]> {
    return await this.prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        creatorId: true,
        workers: {
          select: new SelectAssignedTask(),
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async createTaskForCreator(
    data: CreateTaskDto
  ): Promise<AssignedTaskInfoDto> {
    try {
      const { id } = await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          creatorId: data.creatorId,
        },
      });

      return await this.getFirstAssignedTaskById(id);
    } catch (e) {}
  }

  async create(data: CreateTaskDto): Promise<TaskDto> {
    try {
      const { id } = await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          creatorId: data.creatorId,
        },
      });

      return await this.getFirst(id);
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
      await this.prisma.task.delete({
        where: param,
      });

      return await this.getFirst(param.id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async update(param: UpdateTaskParam, data: UpdateTaskDto): Promise<TaskDto> {
    try {
      await this.prisma.task.update({
        where: param,
        data: data,
      });

      return await this.getFirst(param.id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2002")
          throw new BadRequestException("You try change unique field");
      }
    }
  }

  async removeUsersFromTaskById(
    taskId: number,
    userId: number
  ): Promise<TaskDto> {
    try {
      await this.prisma.assignedTask.delete({
        where: {
          taskid: {
            workerId: userId,
            taskId: taskId,
          },
        },
      });

      return await this.getFirst(taskId);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2003")
          throw new BadRequestException("Incorrect worker");
      }
    }
  }

  async assignUsersToTaskById(
    taskId: number,
    userId: number
  ): Promise<TaskDto> {
    try {
      await this.prisma.assignedTask.create({
        data: {
          taskId: taskId,
          workerId: userId,
        },
      });

      return await this.getFirst(taskId);
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
    await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  async startTask(id: number): Promise<AssignedTaskInfoDto> {
    const date = new Date();
    const task = await this.getFirstAssignedTaskById(id);

    if (task.isComplete) throw new BadRequestException("Task already finished");
    if (task.isStarted) throw new BadRequestException("Task already start");

    try {
      await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          startTime: date,
          isStarted: true,
        },
      });

      return await this.getFirstAssignedTaskById(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async finishTask(id: number): Promise<AssignedTaskInfoDto> {
    const date = new Date();
    const task = await this.getFirstAssignedTaskById(id);

    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");
    if (task.isPaused) throw new BadRequestException("Task on pause!");

    const workTIme = date.getTime() - task.startTime.getTime() - task.pauseTime;

    try {
      await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          endTime: date,
          isComplete: true,
          workTime: workTIme,
        },
      });

      return await this.getFirstAssignedTaskById(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async startPause(id: number): Promise<AssignedTaskInfoDto> {
    const task = await this.getFirstAssignedTaskById(id);

    if (task.isPaused) throw new BadRequestException("Task already paused");
    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");

    try {
      const date = new Date();
      await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          startPauseTime: date,
          isPaused: true,
        },
      });

      return await this.getFirstAssignedTaskById(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async endPause(id: number): Promise<AssignedTaskInfoDto> {
    const task = await this.getFirstAssignedTaskById(id);

    if (task.isComplete) throw new BadRequestException("Task already finish");
    if (!task.isStarted) throw new BadRequestException("Task not yet start");
    if (!task.isPaused) throw new BadRequestException("Task not paused");

    try {
      const date = new Date();
      let pauseTime = date.getTime() - task.startPauseTime.getTime();

      if (task.pauseTime) {
        pauseTime += task.pauseTime;
      }

      await this.prisma.assignedTask.update({
        where: {
          id: id,
        },
        data: {
          pauseTime: pauseTime,
          isPaused: false,
          endPauseTime: date,
          startPauseTime: null,
        },
      });

      return await this.getFirstAssignedTaskById(id);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  private async getFirstAssignedTaskById(
    id: number
  ): Promise<AssignedTaskInfoDto> {
    const data = await this.prisma.assignedTask.findFirst({
      where: {
        id: id,
      },
      include: {
        task: true,
      },
    });

    if (!data) throw new BadRequestException("Task not exists");
    const { task, ...info } = data;

    return { ...data.task, ...info };
  }
}
