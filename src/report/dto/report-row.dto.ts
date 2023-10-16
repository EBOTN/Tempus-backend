import { ApiProperty } from "@nestjs/swagger";
import { TaskModel } from "src/task/dto/task-model-dto";
import { TimeLineDto } from "src/time-line/dto/time-line-dto";
import { UserDto } from "src/user/dto/user-dto";

export class ReportRowDto {
  @ApiProperty({
    description: "Member info",
    type: UserDto,
  })
  readonly member: UserDto;

  @ApiProperty({
    description: "Project title",
  })
  readonly projectTitle: string;

  @ApiProperty({
    description: "Task info",
    type: TaskModel,
  })
  readonly task: TaskModel;

  @ApiProperty({
    description: "Total tracked time",
    type: TimeLineDto,
  })
  readonly timeLine: TimeLineDto;

  @ApiProperty({
    description: "Total tracked time",
  })
  readonly trackedTime: number;

  @ApiProperty({
    description: "Total tracked time",
  })
  readonly day: Date;
}
