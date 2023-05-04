import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TimeLineService } from "src/time-line/time-line.service";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTaskQuery } from "./dto/get-task-query";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { TaskDto } from "./dto/task-dto";
import { SelectorTaskDto } from "./dto/selector-task-dto";

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private timeLineService: TimeLineService
  ) {}

  async getFirst(taskId: number): Promise<TaskDto> {
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

  async getCreatedTasksByUserId(
    query: GetTaskQuery,
    userId: number,
    projectId: number
  ): Promise<TaskDto[]> {
    try {
      const data = await this.prisma.task.findMany({
        where: {
          title: {
            contains: query.title || "",
            mode: "insensitive",
          },
          creatorId: userId,
          projectId,
        },
        select: SelectorTaskDto,
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
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async getByProject(projectId: number): Promise<TaskDto[]> {
    const data = await this.prisma.task.findMany({
      where: { projectId },
      select: SelectorTaskDto,
      orderBy: {
        id: "asc",
      },
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

  async removeUserFromTask(taskId: number, userId: number) {
    try {
      await this.prisma.assignedTask.delete({
        where: {
          taskid: {
            memberId: userId,
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
          memberId: userId,
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
        },
      });
    } catch (e) {}
  }
}
