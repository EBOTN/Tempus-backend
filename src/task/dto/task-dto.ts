import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import { TaskModel } from "./task-model-dto";
import { MemberDto } from "src/shared/member-dto";

export class MembersInfo {
  @ApiProperty({ description: "User info", type: MemberDto })
  readonly member: MemberDto;

  @ApiProperty({ description: "Task isComplete by user?", example: true })
  readonly isComplete: boolean;

  @ApiProperty({ description: "How much user track time", example: 1000 })
  readonly workTime: number;
}

export class TaskDto extends TaskModel {
  @ApiProperty({ description: "Members assigned to task", type: [MembersInfo] })
  readonly members: MembersInfo[];
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
