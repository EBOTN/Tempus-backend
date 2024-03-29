import { ApiProperty } from "@nestjs/swagger";
import { MemberDto } from "src/shared/member-dto";
import { TimeLineDto } from "src/time-line/dto/time-line-dto";
import { UserDto } from "src/user/dto/user-dto";

export class AssignedTaskDto {
  @ApiProperty({ example: "1", description: "Assigned task id" })
  readonly id: number;

  @ApiProperty({ example: "1", description: "Task id" })
  readonly taskId: number;

  @ApiProperty({ example: "1", description: "Member id" })
  readonly memberId: number;

  @ApiProperty({ example: false, description: "Task started?" })
  readonly isActive: boolean;

  @ApiProperty({ example: false, description: "Task completed?" })
  readonly isComplete: boolean;

  @ApiProperty({example: "1000", description: "Task work time"})
  readonly workTime: number;

  @ApiProperty({
    type: [TimeLineDto],
    description: "Time lines",
  })
  readonly TimeLines: TimeLineDto[];

  @ApiProperty({
    type: UserDto,
    description: "Member info"
  })
  readonly member: UserDto;
}
