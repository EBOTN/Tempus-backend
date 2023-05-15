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
    description: "Assigned filter",
    required: false,
  })
  @IsOptional()
  @IsIn(["assigned", "unassigned", "all"], {
    message:
      "filter must be one of the following values: assigned, unassigned, all",
  })
  readonly filter?: string;

  @ApiProperty({
    example: "workspace",
    description: "Completed filter",
    required: false,
  })
  @IsOptional()
  @Equals("Completed")
  readonly completedFilter?: string;
}
