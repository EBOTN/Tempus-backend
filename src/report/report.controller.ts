import { Controller, Post, Body } from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReportDto } from "./dto/report.dto";

@ApiTags("report")
@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({ summary: "Generate report" })
  @ApiResponse({ status: 200, type: ReportDto })
  @Post()
  generateReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.generateReport(createReportDto);
  }
}
