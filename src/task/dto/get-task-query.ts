import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  Equals,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class GetTaskQuery {
  @ApiProperty({ example: "Title", description: "Task title", required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    example: 1,
    description: "Offset of tasks",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly offset?: number;

  @ApiProperty({
    example: 1,
    description: "Limit of tasks",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    example: "all",
    description: "Assigned filter (assigned/unassigned/all)",
    required: false,
  })
  @IsOptional()
  @IsIn(["assigned", "unassigned", "all"], {
    message:
      "filter must be one of the following values: assigned, unassigned, all",
  })
  readonly assignedFilter?: string;

  @ApiProperty({
    example: "completed",
    description: "Completed filter (completed/uncompleted)",
    required: false,
  })
  @IsOptional()
  @IsIn(["completed", "uncompleted"], {
    message: "completed filter must be one of the following values: completed, uncompleted"
  })
  readonly completedFilter?: string;
}
