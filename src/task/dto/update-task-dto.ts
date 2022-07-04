import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
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

  @ApiProperty({
    type: [Number],
    description: "Array workers are assigned to task",
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayUnique()
  readonly addedWorkers?: number[];

  @ApiProperty({
    type: [Number],
    description: "Array workers are removed from task",
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayUnique()
  readonly removedWorkers?: number[];
}
