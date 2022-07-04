import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateTaskParam {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}
