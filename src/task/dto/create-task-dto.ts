import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: "Title", description: "Task title" })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: "Description",
    description: "Task description (Optional)",
    required: false
  })
  @IsOptional()
  @IsString()
  readonly description: string;

  @ApiProperty({ example: "2", description: "Creator id" })
  @IsNotEmpty()
  @IsNumber()
  readonly creatorId: number;
}
