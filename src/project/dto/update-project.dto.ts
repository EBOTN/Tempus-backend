import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateProjectDto } from "./create-project.dto";
import { IsNotEmpty, IsBoolean, IsOptional } from "class-validator";

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ["workspaceId"])
) {
  @ApiProperty({
    example: true,
    description: "Whether to hide the project from visible",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  readonly isHidden?: boolean;
}
