import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsBoolean, IsString } from "class-validator";

export class ProjectModel {
  @ApiProperty({
    example: 1,
    description: "Whether to hide the project from visible",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  readonly id: number;

  @ApiProperty({
    example: "Title 1",
    description: "Title description",
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: "Description 1",
    description: "Project description",
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: true,
    description: "Whether to hide the project from visible",
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly isHidden: boolean;

  @ApiProperty({
    example: 2,
    description: "Workspace id",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  readonly workspaceId: number;
}
