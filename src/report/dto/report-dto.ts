import { FullTimeLineDto } from "src/time-line/dto/full-time-line-dto";

export class ReportDto {
  date: string;
  data: DayReportDto[];
  workTime: number;
}
export class DayReportDto {
  readonly title: string;
  readonly description?: string;
  readonly timeLines: FullTimeLineDto[];
  readonly workTime: number;
}
