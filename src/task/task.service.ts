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
          TimeLines: true,
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

  async startTask(assTaskId: number, userId: number) {
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
        isActive: true,
      },
    });
    if (activeTask) throw new BadRequestException("Task already started");
    if (activeTimeLine) await this.finishTask(activeTimeLine.taskId);
    try {
      return await this.prisma.assignedTask.update({
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
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      console.log(e);
      
    }
  }

  async finishTask(assTaskId: number) {
    const date = new Date();
    const lastTimeLine = await this.prisma.timeLines.findFirst({
      where: {
        taskId: assTaskId,
        startTime: { not: null },
        endTime: null,
      },
    });
    if (!lastTimeLine) throw new BadRequestException("Task not started");
    try {
      return await this.prisma.assignedTask.update({
        where: {
          id: assTaskId,
        },
        data: {
          isActive: false,
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
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      console.log(e)
    }
  }

  // async startPause(
  //   taskId: number,
  //   userId: number
  // ): Promise<AssignedTaskInfoDto> {
  //   const task = await this.getFirstAssignedTaskById(taskId, userId);

  //   if (task.isPaused) throw new BadRequestException("Task already paused");
  //   if (task.isComplete) throw new BadRequestException("Task already finish");
  //   if (!task.isStarted) throw new BadRequestException("Task not yet start");

  //   try {
  //     const date = new Date();
  //     await this.prisma.assignedTask.update({
  //       where: {
  //         taskid: {
  //           taskId: taskId,
  //           workerId: userId,
  //         },
  //       },
  //       data: {
  //         startPauseTime: date,
  //         isPaused: true,
  //       },
  //     });

  //     return await this.getFirstAssignedTaskById(taskId, userId);
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (e.code === "P2025")
  //         throw new BadRequestException("Task not exists");
  //     }
  //   }
  // }

  // async endPause(taskId: number, userId: number): Promise<AssignedTaskInfoDto> {
  //   const task = await this.getFirstAssignedTaskById(taskId, userId);

  //   if (task.isComplete) throw new BadRequestException("Task already finish");
  //   if (!task.isStarted) throw new BadRequestException("Task not yet start");
  //   if (!task.isPaused) throw new BadRequestException("Task not paused");

  //   try {
  //     await this.checkTraceableTask(userId);
  //     const date = new Date();
  //     let pauseTime = date.getTime() - task.startPauseTime.getTime();

  //     if (task.pauseTime) {
  //       pauseTime += task.pauseTime;
  //     }

  //     await this.prisma.assignedTask.update({
  //       where: {
  //         taskid: {
  //           taskId: taskId,
  //           workerId: userId,
  //         },
  //       },
  //       data: {
  //         pauseTime: pauseTime,
  //         isPaused: false,
  //         endPauseTime: date,
  //         startPauseTime: null,
  //       },
  //     });

  //     return await this.getFirstAssignedTaskById(taskId, userId);
  //   } catch (e) {
  //     if (e instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (e.code === "P2025")
  //         throw new BadRequestException("Task not exists");
  //     }
  //   }
  // }

  private async getFirstAssignedTaskById(taskId: number, userId: number) {
    // const data = await this.prisma.assignedTask.findFirst({
    //   where: {
    //     taskId: taskId,
    //     workerId: userId,
    //   },
    //   include: {
    //     task: true,
    //   },
    // });
    // if (!data) throw new BadRequestException("Task not exists");
    // const { task, ...info } = data;
    // return { ...data.task, ...info };
  }

  private async checkTraceableTask(userId: number) {
    //   const date = new Date();
    //   const traceableTask = await this.prisma.assignedTask.findFirst({
    //     where: {
    //       workerId: userId,
    //       isStarted: true,
    //       isPaused: false,
    //       isComplete: false,
    //     },
    //   });
    //   if (traceableTask) {
    //     // await this.startPause()
    //     await this.prisma.assignedTask.update({
    //       where: {
    //         taskid: {
    //           taskId: traceableTask.taskId,
    //           workerId: userId,
    //         },
    //       },
    //       data: {
    //         isPaused: true,
    //         startPauseTime: date,
    //       },
    //     });
    //   }
    // }
  }
}
