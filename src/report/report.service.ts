import { Injectable } from "@nestjs/common";
import { TimeLines } from "@prisma/client";
import { FullTimeLineDto } from "src/time-line/dto/full-time-line-dto";
import { TimeLineService } from "src/time-line/time-line.service";
import { ReportDto } from "./dto/report-dto";

@Injectable()
export class ReportService {
  constructor(
    private timeLineService: TimeLineService,
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

    const timeLinesBetweenDates =
      await this.timeLineService.getAllTimeLinesByWorkerBetweenDates(
        workerId,
        startTimeLine,
        endTimeLine
      );

    const returnedData = dividedTimeLines.map((workerTimeLine) => {
      var info: ReportDto = new ReportDto();

      const month = workerTimeLine.startTime.getMonth() + 1;
      const day = workerTimeLine.startTime.getDate();
      const year = workerTimeLine.startTime.getFullYear();

      timeLinesBetweenDates.map((obj) => {
        const approvedTimeLines = obj.TimeLines.filter((timeLine) => {
          if (timeLine.endTime === null) return false;
          if (
            timeLine.startTime >= workerTimeLine.startTime &&
            timeLine.endTime <= workerTimeLine.endTime &&
            timeLine.taskId === obj.taskId
          ) {
            return true;
          }

          return false;
        }) as FullTimeLineDto[];

        // initialize fields of info
        if (approvedTimeLines.length <= 0) return;
        if (!info.date && !info.data && !info.workTime) {
          info.date = `${day}.${month}.${year}`;
          info.data = [];
          info.workTime = 0;
        }

        let taskWorkTime: number = 0;
        approvedTimeLines.map((approvedTimeLine) => {
          taskWorkTime +=
            approvedTimeLine.endTime.getTime() -
            approvedTimeLine.startTime.getTime();
          approvedTimeLine.workTime =
            approvedTimeLine.endTime.getTime() -
            approvedTimeLine.startTime.getTime();
        });

        info.workTime += taskWorkTime;
        info.data.push({
          title: obj.task.title,
          description: obj.task.description,
          timeLines: approvedTimeLines,
          workTime: taskWorkTime,
        });
      });

      if (Object.keys(info).length !== 0) {
        return info;
      }
    });
    return returnedData.filter((a) => a);
  }
}
