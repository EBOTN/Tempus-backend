import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
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
}
