import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

  @ApiProperty({
    example: "workspace",
    description: "Workspace title",
    required: false,
  })
  @IsOptional()
  @IsIn(['true', 'false', true, false],{message: 'isOwned must be one of the following values: true, false'})
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  readonly isOwned?: boolean;
}
