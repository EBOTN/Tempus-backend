import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetWorkspacesQuerry {
  @ApiProperty({
    example: 1,
    description: "Offset of workspaces",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly offset?: number;

  @ApiProperty({
    example: 1,
    description: "Limit of workspaces",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    example: "workspace",
    description: "Workspace title",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;
}
