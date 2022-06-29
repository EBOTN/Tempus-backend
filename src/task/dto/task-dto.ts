import { ApiProperty } from "@nestjs/swagger";
import { userDTO } from "src/models/user-dto";

export class TaskDto {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  readonly id: number;

  @ApiProperty({ example: "Title", description: "Task title" })
  readonly title: string;

  @ApiProperty({ example: "Description", description: "Task description" })
  readonly description: string;

  @ApiProperty({ description: "Creator of task" })
  readonly creator: userDTO;

  @ApiProperty({ description: "Task worker" })
  readonly worker: userDTO;
}
