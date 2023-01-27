import { OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";
import { ProjectModel } from "./project-model";

export class CreateProjectDto extends OmitType(ProjectModel, ['id', 'isHidden']) {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly workspaceId: number;
}
