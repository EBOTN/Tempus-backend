import { ApiProperty } from "@nestjs/swagger";
import { FullTimeLineDto } from "src/time-line/dto/full-time-line-dto";
import { TimeLineDto } from "src/time-line/dto/time-line-dto";

export class AssignedTaskDto {
  @ApiProperty({ example: "1", description: "Assigned task id" })
  readonly id: number;

  @ApiProperty({ example: "1", description: "Task id" })
  readonly taskId: number;

  @ApiProperty({ example: "1", description: "Worker id" })
  readonly workerId: number;

  @ApiProperty({ example: false, description: "Task started?" })
  readonly isActive: boolean;

  @ApiProperty({ example: false, description: "Task completed?" })
  readonly isComplete: boolean;

  @ApiProperty({example: "1000", description: "Task work time"})
  readonly workTime: number;

  @ApiProperty({
    type: [TimeLineDto],
    description: "Time lines",
  })
  readonly TimeLines: TimeLineDto[];
}
