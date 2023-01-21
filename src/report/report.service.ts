import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FullTimeLineDto } from "src/time-line/dto/full-time-line-dto";
import { TimeLineService } from "src/time-line/time-line.service";
import { DayReportDto, ReportDto } from "./dto/report-dto";

@Injectable()
export class ReportService {
  constructor(
    private timeLineService: TimeLineService,
    private prismaService: PrismaService
  ) {}

  async getReportForWorker(
    startTimeLine: Date,
    endTimeLine: Date,
    workerId: number
  ): Promise<ReportDto[]> {
    const dividedTimeLines = this.timeLineService.divTimeLine(
      startTimeLine,
      endTimeLine
    ) || [{ startTime: startTimeLine, endTime: endTimeLine }];
    const returnedData: ReportDto[] = [];
    for (let i = 0; i < dividedTimeLines.length; i++) {
      const month = dividedTimeLines[i].startTime.getMonth() + 1;
      const day = dividedTimeLines[i].startTime.getDate();
      const year = dividedTimeLines[i].startTime.getFullYear();
      returnedData.push({
        date: `${day}.${month}.${year}`,
        data: [],
        workTime: 0,
      });
    }
    const tasks = await this.prismaService.task.findMany({
      // Задачи, которые выполнялись в указанный промежуток
      where: {
        workers: {
          some: {
            workerId: workerId,
            TimeLines: {
              some: {
                startTime: { gte: startTimeLine },
                endTime: { lte: endTimeLine },
              },
            },
          },
        },
      },
      include: {
        workers: {
          include: { TimeLines: true },
          where: {
            workerId: workerId,
            TimeLines: {
              some: {
                startTime: { gte: startTimeLine },
                endTime: { lte: endTimeLine },
              },
            },
          },
        },
      },
    });

    for (let i = 0; i < dividedTimeLines.length; i++) {
      const currentDay = dividedTimeLines[i]; // день из заданного промежутка
      const tasksInCurrentDay = tasks.filter((obj) =>
        obj.workers.filter(
          (worker) =>
            worker.TimeLines.filter(
              (timeLine) =>
                timeLine.startTime > currentDay.startTime &&
                timeLine.endTime < currentDay.endTime
            ).length > 0 //фильтруем таски так, чтобы у неё был хоть один таймлайн в currentDay
        )
      ); // фильтруем таски, которые выполнялись в currentDay
      let taskWorkTime: number = 0;
      // проходим по таскам, которые отслеживались в currentDay
      for (let j = 0; j < tasksInCurrentDay.length; j++) {
        const currentTask = tasksInCurrentDay[j];
        tasksInCurrentDay[j].workers[0].TimeLines = tasksInCurrentDay[
          j
        ].workers[0].TimeLines.filter(
          (obj) =>
            obj.startTime > currentDay.startTime &&
            obj.endTime < currentDay.endTime
        ); // убираем таймлайны, не вписывающиеся в currentDay

        const extendedTimeLine: FullTimeLineDto[] = tasksInCurrentDay[
          j
        ].workers[0].TimeLines.map((item) => {
          const workTime = item.endTime.getTime() - item.startTime.getTime();
          taskWorkTime += workTime;
          return { ...item, workTime };
        }); // добавляем в таймлайн его длительность

        const returnedItem: DayReportDto = {
          title: currentTask.title,
          description: currentTask.description,
          timeLines: extendedTimeLine,
          workTime: taskWorkTime,
        };

        returnedData[i].data.push(returnedItem);
      }
    }
    return;
  }
}
