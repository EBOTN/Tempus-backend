import { Module } from "@nestjs/common";
import { TimeLineModule } from "src/time-line/time-line.module";
import { ReportService } from "./report.service";

@Module({
  controllers: [],
  providers: [ReportService],
  imports: [TimeLineModule],
  exports: [ReportService, TimeLineModule],
})
export class ReportModule {}
