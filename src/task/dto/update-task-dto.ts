import { ApiProperty } from "@nestjs/swagger";
import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateTaskDto {
  @ApiProperty({ example: "Title", description: "Task title" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  @ApiProperty({ example: "Description", description: "Task description" })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ example: "1", description: "Worker id" })
  @IsOptional()
  @IsNumber()
  readonly workerId?: number;
}
