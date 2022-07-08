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
      throw new BadRequestException("sad");
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
      await this.prisma.task.update({
        where: param,
        data: data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2002")
          throw new BadRequestException("You try change unique field");
      }
    }
  }

  async removeUsersFromTaskById(taskId: number, userId: number) {
    try {
      await this.prisma.assignedTask.delete({
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
    await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  async startTimeLine(assTaskId: number, userId: number) {
    const date = new Date();

    const activeTimeLine = await this.prisma.timeLines.findFirst({
      where: {
        AssignedTask: {
          workerId: userId,
          isActive: true,
        },
      },
    });
    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        id: assTaskId,
      },
      include: {
        TimeLines: true,
      },
    });
    if (activeTask.isActive)
      throw new BadRequestException("Task already started");
    if (activeTask.isComplete)
      throw new BadRequestException("Task already closed");
    if (activeTimeLine) await this.endTimeLine(activeTimeLine.taskId);
    try {
      const data = await this.prisma.assignedTask.update({
        where: {
          id: assTaskId,
        },
        data: {
          isActive: true,
          TimeLines: {
            create: {
              startTime: date,
            },
          },
        },
        include: {
          TimeLines: true,
          task: {
            include: {
              workers: {
                include: {
                  TimeLines: true,
                },
              },
            },
          },
        },
      });
      const { task } = data;
      return { workers: task.workers };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      console.log(e);
    }
  }

  async endTimeLine(assTaskId: number) {
    const date = new Date();
    const lastTimeLine = await this.prisma.timeLines.findFirst({
      where: {
        taskId: assTaskId,
        startTime: { not: null },
        endTime: null,
      },
    });
    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        id: assTaskId,
        isActive: true,
      },
    });
    if (!lastTimeLine) throw new BadRequestException("Task not started");
    if (activeTask.isComplete)
      throw new BadRequestException("Task already closed");
    try {
      const newWorkTime =
        date.getTime() - lastTimeLine.startTime.getTime() + activeTask.workTime;

      const data = await this.prisma.assignedTask.update({
        where: {
          id: assTaskId,
        },
        data: {
          isActive: false,
          workTime: newWorkTime,
          TimeLines: {
            update: {
              where: {
                id: lastTimeLine.id,
              },
              data: {
                endTime: date,
              },
            },
          },
        },
        include: {
          TimeLines: true,
          task: {
            include: {
              workers: {
                include: {
                  TimeLines: true,
                },
              },
            },
          },
        },
      });

      const { task } = data;
      return { workers: task.workers };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      console.log(e);
    }
  }
  async completeTask(assTaskId: number) {
    const lastTimeLine = await this.prisma.timeLines.findFirst({
      where: {
        taskId: assTaskId,
        startTime: { not: null },
        endTime: null,
      },
    });
    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        id: assTaskId,
      },
    });
    if (activeTask.isComplete)
      throw new BadRequestException("Task already closed");
    if (lastTimeLine) await this.endTimeLine(assTaskId);
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
          task: {
            include: {
              workers: {
                include: {
                  TimeLines: true,
                },
              },
            },
          },
        },
      });
    } catch (e) {}
  }
}
