import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReadTaskQuery {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly userId: number;
}
