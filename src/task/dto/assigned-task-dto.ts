import { ApiProperty } from "@nestjs/swagger";

export class AssignedTaskDto {
  @ApiProperty({ example: "1", description: "Assigned task id" })
  readonly id: number;

  @ApiProperty({ example: "1", description: "Task id" })
  readonly taskId: number;

  @ApiProperty({ example: "1", description: "Worker id" })
  readonly workerId: number;

  @ApiProperty({ example: "1", description: "Task started?" })
  readonly isStarted: boolean;

  @ApiProperty({ example: "1", description: "Task completed?" })
  readonly isComplete: boolean;

  @ApiProperty({ description: "Task start time" })
  readonly startTime: Date;

  @ApiProperty({ description: "Task end time" })
  readonly endTime: Date;

  @ApiProperty({ example: "1", description: "Task paused?" })
  readonly isPaused: boolean;

  @ApiProperty({ example: "10000", description: "Worker work time" })
  readonly workTime: number;

  @ApiProperty({ example: "10000", description: "Worker pause time" })
  readonly pauseTime: number;
}