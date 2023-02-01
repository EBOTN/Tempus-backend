import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsString,
  IsOptional,
} from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";

export class WorkspaceModel {
  @ApiProperty({
    example: 1,
    description: "Workspace id",
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly id: number;

  @ApiProperty({
    example: "Workspace 1",
    description: "Workspace title",
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: "http://.../api/image/image1",
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
  @Type(() => Number)
  readonly ownerId: number;

  @ApiProperty({
    type: "string",
    required: false,
    format: "binary",
    description: "Image cover",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsFile()
  @HasMimeType(["image/jpeg", "image/png"])
  readonly coverFile?: MemoryStoredFile;
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
