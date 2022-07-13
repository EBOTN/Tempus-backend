import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Prisma, TimeLines } from "@prisma/client";
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

  async startTimeLine(assTaskId: number, userId: number) {
    const date = new Date();

    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        OR: [
          {
            workerId: userId,
            isActive: true,
          },
          {
            id: assTaskId,
          },
        ],
      },
    });

    if (!activeTask) throw new BadRequestException("Task not found");
    if (activeTask.isActive && activeTask.id === assTaskId)
      throw new BadRequestException("Task already started");
    if (activeTask.isComplete && activeTask.id === assTaskId)
      throw new BadRequestException("Task already closed");
    if (activeTask.isActive) await this.endTimeLine(activeTask.id);
    if (!this.checkWorkHours(userId))
      throw new BadRequestException("You already work 40 hours");
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
    }
  }

  async endTimeLine(assTaskId: number) {
    const date = new Date();
    // date.setDate(15);
    const activeTimeLine = await this.prisma.timeLines.findFirst({
      where: {
        taskId: assTaskId,
        startTime: { not: null },
        endTime: null,
      },
      include: {
        AssignedTask: true,
      },
    });

    if (!activeTimeLine) throw new BadRequestException("Task not started");
    if (activeTimeLine.AssignedTask.isComplete)
      throw new BadRequestException("Task already closed");

    const timeLineWorkTime =
      date.getTime() - activeTimeLine.startTime.getTime();

    try {
      let newWorkTime;
      if (timeLineWorkTime > 60000) {
        newWorkTime = timeLineWorkTime + activeTimeLine.AssignedTask.workTime;
      } else {
        newWorkTime = activeTimeLine.AssignedTask.workTime;
      }

      const timelines = this.divTimeLine(activeTimeLine.startTime, date);
      if (timelines)
        return await this.saveTimeLines(
          timelines,
          assTaskId,
          activeTimeLine.id,
          newWorkTime
        );
      const updatedAssTask = await this.prisma.assignedTask.update({
        where: {
          id: assTaskId,
        },
        data: {
          isActive: false,
          workTime: newWorkTime,
          TimeLines: {
            update: {
              where: {
                id: activeTimeLine.id,
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
      if (newWorkTime === activeTimeLine.AssignedTask.workTime)
        throw new BadRequestException({
          ...updatedAssTask,
          message: "You work enough!",
        });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      if (e instanceof BadRequestException) throw e;
      console.log(e);
    }
  }

  async completeTask(assTaskId: number) {
    const completedTask = await this.prisma.timeLines.findFirst({
      where: {
        taskId: assTaskId,
        OR: [
          { startTime: { not: null }, endTime: null, taskId: assTaskId },
          { taskId: assTaskId },
        ],
      },
      include: {
        AssignedTask: true,
      },
    });

    if (!completedTask) throw new BadRequestException("Task not found");
    if (completedTask.AssignedTask.isComplete)
      throw new BadRequestException("Task already complete");
    if (completedTask.startTime && !completedTask.endTime)
      await this.endTimeLine(assTaskId);

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

  // need assTaskId and timeLineId
  divTimeLine(
    startTime: Date,
    endTime: Date
  ): { startTime: Date; endTime: Date }[] {
    var timeLines = [];

    const startTimeCopy = new Date(startTime);
    const endTimeCopy = new Date(endTime);

    startTimeCopy.setUTCHours(0, 0, 0, 0);
    endTimeCopy.setUTCHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (endTimeCopy.getTime() - startTimeCopy.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays < 1) return null;

    const endStartTimeDate = new Date(startTime);
    const startEndTimeDate = new Date(endTime);

    endStartTimeDate.setUTCHours(23, 59, 59, 999);
    startEndTimeDate.setUTCHours(0, 0, 0, 0);

    timeLines.push({ startTime: startTime, endTime: endStartTimeDate });

    for (var i = 1; i < diffDays; i++) {
      const startTimeNextDay = new Date(startTime);
      startTimeNextDay.setDate(startTimeNextDay.getDate() + i);
      startTimeNextDay.setUTCHours(0, 0, 0, 0);
      const endTimeNextDay = new Date(startTimeNextDay);

      endTimeNextDay.setUTCHours(23, 59, 59, 999);
      timeLines.push({
        startTime: startTimeNextDay,
        endTime: endTimeNextDay,
      });
    }

    timeLines.push({ startTime: startEndTimeDate, endTime: endTime });

    return timeLines;
  }

  async checkWorkHours(workerId: number) {
    const date = new Date();
    const startWeekOfDate = new Date(date);
    const endWeekOfDate = new Date(date);

    if (date.getDay() != 0) {
      startWeekOfDate.setDate(date.getDate() - date.getDay());
      startWeekOfDate.setUTCHours(0, 0, 0, 0);

      endWeekOfDate.setDate(date.getDate() - date.getDay() + 6);
      endWeekOfDate.setUTCHours(0, 0, 0, 0);
    }

    const tasks = await this.prisma.assignedTask.findMany({
      where: {
        workerId: workerId,
        TimeLines: {
          some: {
            startTime: { gte: startWeekOfDate },
            endTime: { lte: endWeekOfDate },
          },
        },
      },
      include: {
        TimeLines: true,
      },
    });
    console.log(tasks);
    let ms;
    tasks.map((task) => {
      task.TimeLines.map((timeline) => {
        ms += timeline.endTime.getTime() - timeline.startTime.getTime();
      });
    });

    if (ms >= 144000000) return false;

    return true;
  }

  async getReportForWorker(
    startTimeLine: Date,
    endTimeLine: Date,
    workerId: number
  ) {
    const timeLines = this.divTimeLine(startTimeLine, endTimeLine) || [
      { startTime: startTimeLine, endTime: endTimeLine },
    ];

    const bebra = await this.prisma.assignedTask.findMany({
      where: {
        workerId: workerId,
        TimeLines: {
          some: {
            startTime: { gte: startTimeLine },
            endTime: { lte: endTimeLine },
          },
        },
      },
      include: {
        TimeLines: true,
        task: true,
      },
    });

    

    const returnedData = timeLines.map((timeLine) => {
      var info: GrouppedTasks = {} as GrouppedTasks;

      const month = timeLine.startTime.getMonth() + 1;
      const day = timeLine.startTime.getDate();
      const year = timeLine.startTime.getFullYear();

      bebra.map((obj) => {
        const a = obj.TimeLines.filter((timeline) => {
          if (
            timeline.startTime >= timeLine.startTime &&
            timeline.endTime <= timeLine.endTime &&
            timeline.taskId === obj.taskId
          ) {
            // console.log(timeline);
            return true;
          }
        }) as MyTimeLine[];
        if (a.length > 0) {
          // console.log(a);
          if (!info.date && !info.data && !info.workTime) {
            info.date = `${day}.${month}.${year}`;
            info.data = [];
            info.workTime = 0;
          }
          let taskWorkTime: number = 0;
          a.map((tl) => {
            taskWorkTime += tl.endTime.getTime() - tl.startTime.getTime();
            tl.workTime = tl.endTime.getTime() - tl.startTime.getTime()
          });
          
          info.workTime += taskWorkTime;
          info.data.push({
            title: obj.task.title,
            description: obj.task.description,
            timeLines: a,
            workTime: taskWorkTime,
          });
        }
      });

      if (Object.keys(info).length !== 0) {
        return info;
      }
    });
    return returnedData.filter((a) => a);
  }

  private async saveTimeLines(
    timelines: { startTime: Date; endTime: Date }[],
    assTaskId: number,
    activeTimeLineId: number,
    newWorkTime: number
  ) {
    const updatedTimeLine = timelines[0];

    timelines.shift();

    return await this.prisma.assignedTask.update({
      where: {
        id: assTaskId,
      },
      data: {
        isActive: false,
        workTime: newWorkTime,
        TimeLines: {
          update: {
            where: {
              id: activeTimeLineId,
            },
            data: {
              endTime: updatedTimeLine.endTime,
            },
          },
          createMany: {
            data: timelines,
          },
        },
      },
      include: {
        TimeLines: true,
      },
    });
  }
}
export interface MyTimeLine extends TimeLines {
  workTime: number
}
export type ReturnedData = {
  title: string;
  description?: string;
  timeLines: MyTimeLine[];
  workTime: number;
};

export type GrouppedTasks = {
  date: string;
  workTime: number;
  data: ReturnedData[];
};