import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetTaskQuery {
  @ApiProperty({ example: "Title", description: "Task title", required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}
