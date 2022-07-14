import { ApiProperty } from "@nestjs/swagger";

export class FullTimeLineDto {
  @ApiProperty({example: "1", description: "Time line id"})
  readonly id: number;
  @ApiProperty({example: "1", description: "Id by worker by task"})
  taskId: number;
  @ApiProperty({ description: "Start date time line"})
  startTime: Date;
  @ApiProperty({ description: "End date time line"})
  endTime: Date;
  @ApiProperty({example: "1000", description: "Work time time line"})
  workTime: number;
}
