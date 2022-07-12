import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, isDate, IsNumber } from "class-validator";
import { AssignedTaskDto } from "./assigned-task-dto";
import { SelectAssignedTask } from "./select-assigned-task-dto";

export class TaskDto {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  readonly id: number;

  @ApiProperty({ example: "Title", description: "Task title" })
  readonly title: string;

  @ApiProperty({ example: "Description", description: "Task description" })
  readonly description: string;

  @ApiProperty({ example: "1", description: "Creator id" })
  readonly creatorId: number;

  @ApiProperty({
    type: [AssignedTaskDto],
    description: "Array workers are assigned to task",
  })
  readonly workers: AssignedTaskDto[];
}

export class Tesst{
  @IsDate()
  @Type(() => Date)
  readonly startTime: Date

  @IsDate()
  @Type(() => Date)
  readonly endTime: Date

  @IsNumber()
  @Type(() => Number)
  readonly workerId: number
}