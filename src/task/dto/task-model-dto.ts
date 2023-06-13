import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/user/dto/user-dto";
import { AssignedTaskDto } from "./assigned-task-dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TaskModel {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  readonly id: number;

  @ApiProperty({ example: "Title", description: "Task title" })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: true,
    type: Boolean,
    description: "Task is complete?",
  })
  readonly isComplete: boolean;

  @ApiProperty({
    example: "Description",
    description: "Task description",
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ description: "Creator" })
  readonly creator: UserDto;
}
