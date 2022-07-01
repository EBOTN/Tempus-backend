import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateTaskDto {
  @ApiProperty({ example: "Title", description: "Task title (Optional)" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  @ApiProperty({
    example: "Description",
    description: "Task description (Optional)",
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ example: "1", description: "Worker id (Optional)" })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly workerId?: number;
}
