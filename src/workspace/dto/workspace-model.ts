import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsBoolean, IsString } from "class-validator";

export class WorkSpaceModel {
  @ApiProperty({
    example: 1,
    description: "WorkSpace id",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  readonly id: number;

  @ApiProperty({
    example: "WorkSpace 1",
    description: "WorkSpace description",
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: "Description 1",
    description: "WorkSpace description",
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 1,
    description: "WorkSpace owner id",
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
