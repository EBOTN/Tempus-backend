import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { ReportDto } from "./dto/report.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigUserWithoutPassword } from "src/user/user.selecter.wpassword";
import { ReportRowDto } from "./dto/report-row.dto";
import { UserDto } from "src/user/dto/user-dto";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}
  async generateReport(createReportDto: CreateReportDto): Promise<ReportDto> {
    const userInfo = await this.prisma.user.findFirst({
      where: {
        id: createReportDto.userId,
      },
      select: new ConfigUserWithoutPassword(),
    });
    createReportDto.dateFrom.setUTCHours(0, 0, 0, 0);
    createReportDto.dateTo.setUTCHours(0, 0, 0, 0);
    if (createReportDto.dateFrom.getTime() === createReportDto.dateTo.getTime())
      createReportDto.dateTo.setUTCHours(23, 59, 59, 999);

    const rawTasks = await this.prisma.task.findMany({
      where: {
        id: createReportDto?.taskId,
        workers: {
          some: {
            member: {
              memberId: createReportDto.userId,
            },
          },
        },
        project: {
          id: createReportDto?.projectId,
          workspaceId: createReportDto?.workspaceId,
        },
      },
      select: {
        id: true,
        title: true,
        isComplete: true,
        description: true,
        creator: { select: new ConfigUserWithoutPassword() },
        workers: {
          select: {
            id: true,
            taskId: true,
            memberId: true,
            isActive: true,
            isComplete: true,
            workTime: true,
            TimeLines: {
              select: {
                startTime: true,
                endTime: true,
              },
              where: {
                startTime: { gte: createReportDto.dateFrom },
                endTime: { lte: createReportDto.dateTo },
                NOT: { endTime: null },
              },
            },
            member: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
    }); // задачи, в которых он принял участие + прогрессы в них
    if (!rawTasks)
      throw new BadRequestException(
        "The report could not be received. Check the data."
      );
    const rows: ReportRowDto[] = [];
    rawTasks.map((rawTask) => {
      const projectTitle = rawTask.project.title;
      delete rawTask["project"];
      const { workers, ...task } = rawTask;
      const member: UserDto = userInfo;
      rawTask.workers.map((rawMemberInfo) => {
        rawMemberInfo.TimeLines.map((timeLine) => {
          const trackedTime = Math.round(
            (timeLine.endTime.getTime() - timeLine.startTime.getTime()) / 1000
          );
          const day = new Date(timeLine.startTime);
          day.setUTCHours(0, 0, 0, 0);
          const row: ReportRowDto = {
            task,
            member,
            projectTitle,
            trackedTime,
            timeLine,
            day,
          };
          rows.push(row);
        });
      });
    });
    let totalTime = 0;
    rows.map((row) => {
      totalTime += row.trackedTime;
    });
    const returnedData: ReportDto = { totalTime, rows };
    return returnedData;
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
