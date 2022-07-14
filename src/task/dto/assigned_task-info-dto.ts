import { ApiProperty } from "@nestjs/swagger";
import { FullTimeLineDto } from "src/time-line/dto/full-time-line-dto";

export class BadRequestAssignedTaskDto {
  @ApiProperty({ example: "Title", description: "Task title" })
  readonly title: string;

  @ApiProperty({ example: "Description", description: "Task description" })
  readonly description: string;

  @ApiProperty({ example: "1", description: "Creator id" })
  readonly creatorId: number;

  @ApiProperty({ example: "1", description: "Assigned task id" })
  readonly id: number;

  @ApiProperty({ example: "1", description: "Task id" })
  readonly taskId: number;

  @ApiProperty({ example: "1", description: "Worker id" })
  readonly workerId: number;

  @ApiProperty({ example: "1", description: "Task started?" })
  readonly isActive: boolean;

  @ApiProperty({})
  readonly workTime: number;

  @ApiProperty({ example: "1", description: "Task completed?" })
  readonly isComplete: boolean;

  readonly TimeLines: FullTimeLineDto[];
}
