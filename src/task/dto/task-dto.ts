import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { TaskModel } from "./task-model-dto";
import { MemberDto } from "src/shared/member-dto";

export class TaskDto extends OmitType(TaskModel, ["workers"]) {
  @ApiProperty({ description: "Members assigned to task" })
  readonly members: {
    member: MemberDto;
    isComplete: boolean;
    workTime: number;
  }[];
}
export class ReportQuerryDto {
  @IsDate()
  @Type(() => Date)
  readonly startTime: Date;

  @IsDate()
  @Type(() => Date)
  readonly endTime: Date;

  @IsNotEmpty()
  @Type(() => Number)
  readonly workerId: number;
}
