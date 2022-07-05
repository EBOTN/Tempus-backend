import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
export class EditUsersToTaskDto {
  @ApiProperty({ example: "1", description: "Updated task id" })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}
