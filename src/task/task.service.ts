import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma, TimeLines } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { BadRequestAssignedTaskDto } from "./dto/assigned_task-info-dto";
import { CreateTaskDto } from "./dto/create-task-dto";
import { ReadTaskQuery } from "./dto/read-task-query";
import { SelectAssignedTask } from "./dto/select-assigned-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { UpdateTaskParam } from "./dto/update-task-param";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private timeLineService: TimeLineService
  ) {}

  async getAssignedTasksByUserId(query: ReadTaskQuery) {
    try {
      const data = await this.prisma.assignedTask.findMany({
        where: {
          workerId: query.userId,
          task: {
            title: {
              contains: query.title || "",
              mode: "insensitive",
            },
          },
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
          TimeLines: true,
        },
        orderBy: {
          id: "asc",
        },
      });

      return data.map((item) => {
        const date = new Date();
        if (item.isActive)
          item.workTime +=
            date.getTime() -
            item.TimeLines[item.TimeLines.length - 1].startTime.getTime();
        const _ = { ...item.task };
        delete item.task;
        return { ..._, ...item };
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(e);
    }
  }

  async getFirst(taskId: number) {
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

  async getCreatedTasksByUserId(query: ReadTaskQuery) {
    const { title, userId } = query;
    try {
      return await this.prisma.task.findMany({
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
            select: { ...new SelectAssignedTask(), TimeLines: true },
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

  async getAll() {
    return await this.prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        creatorId: true,
        workers: {
          select: { ...new SelectAssignedTask(), TimeLines: true },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async createTaskForCreator(data: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          creatorId: data.creatorId,
          workers: {
            create: {
              workerId: data.creatorId,
            },
          },
        },
      });
    } catch (e) {
      throw new BadRequestException("Hohoho");
    }
  }

  async create(data: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          creatorId: data.creatorId,
        },
        include: {
          workers: {
            include: { TimeLines: true },
          },
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

  async remove(param: UpdateTaskParam) {
    try {
      await this.prisma.task.delete({
        where: param,
        include: {
          workers: {
            include: { TimeLines: true },
          },
        },
      });

      return await this.getFirst(param.id);
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
        include: {
          workers: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2002")
          throw new BadRequestException("You try change unique field");
      }
    }
  }

  async removeUserFromTask(taskId: number, userId: number) {
    try {
      await this.prisma.assignedTask.delete({
        where: {
          taskid: {
            workerId: userId,
            taskId: taskId,
          },
        },
        include: {
          TimeLines: true,
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

  async assignUserToTask(taskId: number, userId: number) {
    try {
      return await this.prisma.assignedTask.create({
        data: {
          taskId: taskId,
          workerId: userId,
        },
        include: {
          TimeLines: true,
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

  async completeTask(assTaskId: number) {
    const completedTask = await this.prisma.assignedTask.findFirst({
      where: {
        id: assTaskId,
      },
      include: {
        TimeLines: {
          where: { startTime: { not: null }, endTime: null, taskId: assTaskId },
        },
      },
    });

    if (!completedTask) throw new BadRequestException("Task not found");
    if (completedTask.isComplete)
      throw new BadRequestException("Task already complete");
    if (completedTask.TimeLines.length > 0)
      await this.timeLineService.endTimeLine(assTaskId);

    try {
      return await this.prisma.assignedTask.update({
        where: {
          id: assTaskId,
        },
        data: {
          isActive: false,
          isComplete: true,
        },
        include: {
          TimeLines: true,
          // task: {
          //   include: {
          //     workers: {
          //       include: {
          //         TimeLines: true,
          //       },
          //     },
          //   },
          // },
        },
      });
    } catch (e) {}
  }
}
