import { Controller, Post, Body } from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ReportDto } from "./dto/report.dto";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({ summary: "Get projects by filter" })
  @ApiResponse({ status: 200, type: ReportDto })
  @Post()
  generateReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.generateReport(createReportDto);
  }
}
