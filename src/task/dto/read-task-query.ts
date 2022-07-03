import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReadTaskQuery {
  @ApiProperty({example: 1, description: "User id"})
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly userId: number;
}
