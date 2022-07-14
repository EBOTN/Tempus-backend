import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateTaskParam {
  @ApiProperty({example: "1", description: "Updated task id"})
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}
