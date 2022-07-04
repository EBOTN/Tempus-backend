import { ApiProperty } from "@nestjs/swagger";

export class TaskDto {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  readonly id: number;

  @ApiProperty({ example: "Title", description: "Task title" })
  readonly title: string;

  @ApiProperty({ example: "Description", description: "Task description" })
  readonly description: string;

  @ApiProperty({ example: "1", description: "Creator id" })
  readonly creatorId: number;
}