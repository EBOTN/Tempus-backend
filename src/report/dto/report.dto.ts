import { ApiProperty } from "@nestjs/swagger";
import { ReportRowDto } from "./report-row.dto";

export class ReportDto {
  @ApiProperty({
    description: "Total tracked time",
  })
  readonly totalTime: number;

  @ApiProperty({
    description: "Report rows array",
    type: [ReportRowDto],
  })
  readonly rows: ReportRowDto[];
}
