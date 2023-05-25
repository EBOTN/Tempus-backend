import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTaskQuery } from "./dto/get-task-query";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { TaskDto } from "./dto/task-dto";
import { SelectorTaskDto } from "./dto/selector-task-dto";
import { MemberProgressDto } from "./dto/member-progress-dto";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private timeLineService: TimeLineService
  ) {}

  async getMemberProgress(
    taskId: number,
    userId: number
  ): Promise<MemberProgressDto> {
    const data = await this.prisma.assignedTask.findFirst({
      where: {
        taskId,
        member: {
          member: {
            id: userId,
          },
        },
      },
      select: {
        isActive: true,
        workTime: true,
        isComplete: true,
        TimeLines: {
          orderBy: { startTime: "desc" },
          take: 1,
        },
      },
    });
    if (!data) throw new BadRequestException("PROGRESS NOT FOUND");
    const returnedData = {
      isRunning: false,
      trackedTime: 0,
      lastTimeLineStartTime: null,
      isComplete: data.isComplete,
    };
    if (data.TimeLines.length !== 0) {
      const start = new Date(data.TimeLines[0].startTime);
      returnedData.isRunning = data.isActive;
      returnedData.trackedTime = data.workTime;
      returnedData.lastTimeLineStartTime = data.isActive ? start : null;
    }
    return returnedData;
  }

  async getById(taskId: number): Promise<TaskDto> {
    const data = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      select: SelectorTaskDto,
    });

    const members = data.workers.map((worker) => ({
      member: { ...worker.member.member, role: worker.member.role },
      isComplete: worker.isComplete,
      workTime: worker.workTime,
    }));
    delete data["workers"];

    return { ...data, members };
  }

  async getByFilter(
    query: GetTaskQuery,
    projectId: number,
    userId: number
  ): Promise<TaskDto[]> {
    const filter: {
      workers?: {
        some: { member: { memberId: number } };
      };
      NOT?: {
        workers: {
          some: { member: { memberId: number } };
        };
      };
      isComplete?: boolean;
    } = {};

    query.filter === null
      ? null
      : query.filter === "assigned"
      ? (filter.workers = {
          some: {
            member: {
              memberId: userId,
            },
          },
        })
      : (filter.NOT = {
          workers: {
            some: {
              member: {
                memberId: userId,
              },
            },
          },
        });

    query.completedFilter === null
      ? null
      : query.completedFilter === "completed"
      ? (filter.isComplete = true)
      : (filter.isComplete = false);

    const data = await this.prisma.task.findMany({
      where: {
        projectId,
        title: { contains: query.title || "", mode: "insensitive" },
        ...filter,
      },
      select: SelectorTaskDto,
      skip: query.offset || undefined,
      take: query.limit || undefined,
    });

    const returnedData = data.map((obj) => {
      const members = obj.workers.map((worker) => ({
        member: { ...worker.member.member, role: worker.member.role },
        isComplete: worker.isComplete,
        workTime: worker.workTime,
      }));
      delete obj["workers"];
      return { ...obj, members };
    });

    return returnedData;
  }

  async create(
    data: CreateTaskDto,
    senderId: number,
    projectId: number
  ): Promise<TaskDto> {
    try {
      const rawData = await this.prisma.task.create({
        data: {
          ...data,
          creatorId: senderId,
          projectId,
        },
        select: SelectorTaskDto,
      });
      const members = rawData.workers.map((obj) => ({
        member: { ...obj.member.member, role: obj.member.role },
        isComplete: obj.isComplete,
        workTime: obj.workTime,
      }));
      delete rawData["workers"];
      return { ...rawData, members };
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

  async remove(id: number): Promise<TaskDto> {
    try {
      const data = await this.prisma.task.delete({
        where: { id },
        select: SelectorTaskDto,
      });
      const members = data.workers.map((worker) => ({
        member: { ...worker.member.member, role: worker.member.role },
        isComplete: worker.isComplete,
        workTime: worker.workTime,
      }));
      delete data["workers"];
      return { ...data, members };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async update(id: number, data: UpdateTaskDto): Promise<TaskDto> {
    try {
      const rawData = await this.prisma.task.update({
        where: { id },
        data: data,
        select: SelectorTaskDto,
      });

      const members = rawData.workers.map((worker) => ({
        member: { ...worker.member.member, role: worker.member.role },
        isComplete: worker.isComplete,
        workTime: worker.workTime,
      }));
      delete rawData["workers"];

      return { ...rawData, members };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2002")
          throw new BadRequestException("You try change unique field");
      }
    }
  }

  async removeUserFromTask(taskId: number, userId: number): Promise<TaskDto> {
    try {
      const task = await this.prisma.task.findFirst({
        where: {
          id: taskId,
          workers: {
            some: {
              member: {
                memberId: userId,
              },
            },
          },
        },
        include: {
          workers: true,
        },
      });
      if (!task) throw new BadRequestException("Task not found");

      const taskMemberProgress = task.workers[0];
      const rawData = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          workers: {
            delete: {
              id: taskMemberProgress.id,
            },
          },
        },
        select: SelectorTaskDto,
      });
      const members = rawData.workers.map((obj) => ({
        member: { ...obj.member.member, role: obj.member.role },
        isComplete: obj.isComplete,
        workTime: obj.workTime,
      }));
      delete rawData["workers"];
      return { ...rawData, members };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025") throw new BadRequestException("Incorrect task");
        if (e.code === "P2003")
          throw new BadRequestException("Incorrect worker");
      }
    }
  }

  async assignUserToTask(taskId: number, userId: number): Promise<TaskDto> {
    try {
      const { project } = await this.prisma.task.findFirst({
        where: {
          id: taskId,
        },
        select: {
          project: true,
        },
      });

      if (!project) throw new BadRequestException("Project not found");
      const rawData = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          workers: {
            create: {
              member: {
                connect: {
                  projectId_memberId: {
                    memberId: userId,
                    projectId: project.id,
                  },
                },
              },
            },
          },
        },
        select: SelectorTaskDto,
      });
      const members = rawData.workers.map((obj) => ({
        member: { ...obj.member.member, role: obj.member.role },
        isComplete: obj.isComplete,
        workTime: obj.workTime,
      }));
      delete rawData["workers"];
      return { ...rawData, members };
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

  async unCompleteWork(
    taskId: number,
    userId: number
  ): Promise<MemberProgressDto> {
    const data = await this.prisma.assignedTask.findFirst({
      where: {
        taskId,
        member: {
          memberId: userId,
        },
      },
      include: {
        TimeLines: {
          where: {
            startTime: { not: null },
            endTime: null,
            taskId: taskId,
          },
        },
      },
    });

    if (!data) throw new BadRequestException("You are not assign to task");

    if (!data.isComplete) throw new BadRequestException("Task not complete");

    try {
      const updatedRecord = await this.prisma.assignedTask.update({
        where: {
          id: data.id,
        },
        data: {
          isComplete: false,
        },
        select: {
          isActive: true,
          workTime: true,
          isComplete: true,
          TimeLines: {
            orderBy: { startTime: "desc" },
            take: 1,
          },
        },
      });

      const returnedData = {
        isRunning: updatedRecord.isActive,
        trackedTime: updatedRecord.workTime,
        lastTimeLineStartTime: null,
        isComplete: updatedRecord.isComplete,
      };

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Record not found");
      }
    }
  }

  async completeWork(
    taskId: number,
    userId: number
  ): Promise<MemberProgressDto> {
    const data = await this.prisma.assignedTask.findFirst({
      where: {
        taskId,
        member: {
          memberId: userId,
        },
        isComplete: false,
      },
      include: {
        TimeLines: {
          where: {
            startTime: { not: null },
            endTime: null,
          },
        },
      },
    });

    if (!data) throw new BadRequestException("You are not assign to task");

    if (data.isComplete) throw new BadRequestException("Task already complete");

    if (data.TimeLines.length > 0)
      await this.timeLineService.endTimeLine(taskId, userId);

    try {
      const updatedRecord = await this.prisma.assignedTask.update({
        where: {
          id: data.id,
        },
        data: {
          isComplete: true,
        },
        select: {
          isActive: true,
          workTime: true,
          isComplete: true,
          TimeLines: {
            orderBy: { startTime: "desc" },
            take: 1,
          },
        },
      });

      const returnedData = {
        isRunning: updatedRecord.isActive,
        trackedTime: updatedRecord.workTime,
        lastTimeLineStartTime: null,
        isComplete: updatedRecord.isComplete,
      };

      return returnedData;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Record not found");
      }
    }
  }

  async completeTask(taskId: number): Promise<TaskDto> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        workers: true,
      },
    });
    if (!task) throw new BadRequestException("Task not found");

    task.workers.map((worker) => {
      if (!worker.isComplete)
        throw new BadRequestException(
          "To complete a task, all employees must mark it as completed."
        );
    });

    const rawData = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        isComplete: true,
      },
      select: SelectorTaskDto,
    });
    const members = rawData.workers.map((obj) => ({
      member: { ...obj.member.member, role: obj.member.role },
      isComplete: obj.isComplete,
      workTime: obj.workTime,
    }));
    delete rawData["workers"];

    return { ...rawData, members };
  }

  async unCompleteTask(taskId: number): Promise<TaskDto> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        workers: true,
      },
    });
    if (!task) throw new BadRequestException("Task not found");

    if(!task.isComplete) throw new BadRequestException('Task not completed')

    const rawData = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        isComplete: false,
      },
      select: SelectorTaskDto,
    });
    const members = rawData.workers.map((obj) => ({
      member: { ...obj.member.member, role: obj.member.role },
      isComplete: obj.isComplete,
      workTime: obj.workTime,
    }));
    delete rawData["workers"];

    return { ...rawData, members };
  }
}
