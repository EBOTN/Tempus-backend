import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AssignedTaskDto } from "src/task/dto/assigned-task-dto";
import { TimeLineDto } from "./dto/time-line-dto";
import { SelectorTaskDto } from "src/task/dto/selector-task-dto";
import { TaskDto } from "src/task/dto/task-dto";

@Injectable()
export class TimeLineService {
  constructor(private prisma: PrismaService) {}

  async saveTimeLines(
    timelines: TimeLineDto[],
    taskId: number,
    userId: number,
    activeTimeLineId: number,
    newWorkTime: number
  ): Promise<TaskDto> {
    const updatedTimeLine = timelines[0];
    timelines.shift();
    const rawData = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      select: SelectorTaskDto,
      data: {
        workers: {
          update: {
            where: {
              taskid: {
                taskId,
                memberId: userId,
              },
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
          },
        },
      },
    });

    const members = rawData.workers.map((obj) => ({
      member: { ...obj.member.member, role: obj.member.role },
      isComplete: obj.isComplete,
      workTime: obj.workTime,
    }));
    delete rawData["workers"];
    return { ...rawData, members };
  }

  async getAllTimeLinesByWorkerBetweenDates(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<AssignedTaskDto[]> {
    const data = await this.prisma.assignedTask.findMany({
      where: {
        member: {
          memberId: userId,
        },
        TimeLines: {
          some: {
            startTime: { gte: startDate },
            endTime: { lte: endDate },
          },
        },
      },
      include: {
        TimeLines: true,
        member: {
          select: {
            member: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
      },
    });

    const returnedData = data.map((obj) => {
      const member = { ...obj.member.member, role: obj.member.role };
      delete obj["member"];
      const returnedData = { ...obj, member };
      return returnedData;
    });
    return returnedData;
  }

  async startTimeLine(taskId: number, userId: number): Promise<TaskDto> {
    const date = new Date();
    date.setMilliseconds(0);
    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        OR: [
          {
            member: {
              member: {
                id: userId,
              },
            },
            isActive: true,
          },
          {
            taskId,
            member: {
              member: {
                id: userId,
              },
            },
          },
        ],
      },
      include: {
        member: true,
      },
    });
    if (!activeTask) throw new BadRequestException("Record not found");
    const { member } = activeTask;

    if (activeTask.isActive && activeTask.taskId === taskId)
      throw new BadRequestException("Task already started");

    if (activeTask.isComplete && activeTask.taskId === taskId)
      throw new BadRequestException("Task already closed");

    if (activeTask.isActive) await this.endTimeLine(activeTask.taskId, userId);
    if (await this.checkWeekWorkHours(userId))
      throw new BadRequestException("You already work 40 hours");

    try {
      const rawData = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          workers: {
            update: {
              where: {
                taskid: {
                  taskId,
                  memberId: member.id,
                },
              },
              data: {
                isActive: true,
                TimeLines: {
                  create: {
                    startTime: date,
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
      console.log(e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
    }
  }

  async endTimeLine(taskId: number, userId: number): Promise<TaskDto> {
    const date = new Date();
    date.setMilliseconds(0);

    const activeTask = await this.prisma.assignedTask.findFirst({
      where: {
        taskId,
        member: {
          memberId: userId,
        },
        TimeLines: {
          some: {
            startTime: { not: null },
            endTime: null,
          },
        },
      },
      include: {
        member: true,
        TimeLines: {
          where: {
            startTime: { not: null },
            endTime: null,
          },
          take: 1,
        },
      },
    });

    if (!activeTask) throw new BadRequestException("Task not started");
    const activeTimeLine = activeTask.TimeLines[0];

    if (activeTask.isComplete)
      throw new BadRequestException("Task already closed");

    const timeLineWorkTime =
      date.getTime() - activeTimeLine.startTime.getTime(); // Time line work time
    console.log("asssssssssss", timeLineWorkTime);
    let newWorkTime: number;

    // if user work > 60s then track time
    if (timeLineWorkTime > 60000) {
      newWorkTime = (timeLineWorkTime + activeTask.workTime * 1000) / 1000;
    } else {
      throw new BadRequestException("Time less than a minute is not tracked.");
    } // else time not track

    const timelines = this.divTimeLine(activeTimeLine.startTime, date); // divide time line if can

    if (timelines)
      // if time line divided, then save all timelines
      return await this.saveTimeLines(
        timelines,
        taskId,
        activeTask.memberId,
        activeTimeLine.id,
        newWorkTime
      );

    try {
      const rawData = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          workers: {
            update: {
              where: {
                taskid: {
                  taskId,
                  memberId: activeTask.member.id,
                },
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
        if (e.code === "P2025")
          throw new BadRequestException("Task not exists");
      }
      if (e instanceof BadRequestException) throw e;
      console.log(e);
    }
  }

  divTimeLine(startTimeLine: Date, endTimeLine: Date): TimeLineDto[] {
    const timeLines = [] as TimeLineDto[]; // all time lines

    const firstDayOfTimeLine = new Date(startTimeLine);
    const lastDayOfTimeLine = new Date(endTimeLine);

    firstDayOfTimeLine.setUTCHours(0, 0, 0, 0); // for comparision
    lastDayOfTimeLine.setUTCHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (lastDayOfTimeLine.getTime() - firstDayOfTimeLine.getTime()) /
        (1000 * 3600 * 24)
    ); // how many days between dates

    if (diffDays < 1) return null;

    const endFirstDateTime = new Date(startTimeLine); // end time day for startTimeLine
    const startLastDayTime = new Date(endTimeLine); // start time day for endTimeLine

    endFirstDateTime.setUTCHours(23, 59, 59, 999);
    startLastDayTime.setUTCHours(0, 0, 0, 0);

    timeLines.push({ startTime: startTimeLine, endTime: endFirstDateTime }); // first time line start today, end tomorrow

    for (var i = 1; i < diffDays; i++) {
      const startTimeNextDay = new Date(startTimeLine); // start time for +i day
      startTimeNextDay.setDate(startTimeNextDay.getDate() + i);
      startTimeNextDay.setUTCHours(0, 0, 0, 0);
      const endTimeNextDay = new Date(startTimeNextDay); // end time for +i day

      endTimeNextDay.setUTCHours(23, 59, 59, 999);
      timeLines.push({
        startTime: startTimeNextDay,
        endTime: endTimeNextDay,
      });
    }

    timeLines.push({ startTime: startLastDayTime, endTime: endTimeLine });

    return timeLines;
  }

  async checkWeekWorkHours(userId: number): Promise<boolean> {
    const date = new Date();
    const startWeekOfDate = new Date(date);
    const endWeekOfDate = new Date(date);

    if (date.getDay() != 0) {
      // if today not monday
      startWeekOfDate.setDate(date.getDate() - date.getDay());
      startWeekOfDate.setUTCHours(0, 0, 0, 0);

      endWeekOfDate.setDate(date.getDate() - date.getDay() + 6);
      endWeekOfDate.setUTCHours(0, 0, 0, 0);
    }

    const tasks = await this.getAllTimeLinesByWorkerBetweenDates(
      userId,
      startWeekOfDate,
      endWeekOfDate
    );

    let weekWorkTime: number;
    tasks.map((task) => {
      task.TimeLines.map((timeline) => {
        weekWorkTime +=
          timeline.endTime.getTime() - timeline.startTime.getTime();
      });
    });

    if (weekWorkTime >= 144000000) return true;

    return false;
  }
}
