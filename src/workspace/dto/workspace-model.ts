import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsBoolean, IsString } from "class-validator";

export class WorkspaceModel {
  @ApiProperty({
    example: 1,
    description: "Workspace id",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  readonly id: number;

  @ApiProperty({
    example: "Workspace 1",
    description: "Workspace title",
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: "Description 1",
    description: "Workspace cover(url)",
  })
  @IsNotEmpty()
  @IsString()
  readonly cover: string;

  @ApiProperty({
    example: 1,
    description: "Workspace owner id",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  readonly ownerId: number;

//   @ApiProperty({
//     example: true,
//     description: "Whether to hide the project from visible",
//   })
//   @IsNotEmpty()
//   @IsBoolean()
//   readonly isHidden: boolean;

//   @ApiProperty({
//     example: 2,
//     description: "Workspace id",
//   })
//   @IsNotEmpty()
//   @IsNumber()
//   @Type(()=>Number)
//   readonly workspaceId: number;
}
