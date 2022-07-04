import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ReadTaskQuery {
  @ApiProperty({ example: 1, description: "User id", required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly userId: number;

  @ApiProperty({ example: 1, description: "Task title", required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly title: string;
}
