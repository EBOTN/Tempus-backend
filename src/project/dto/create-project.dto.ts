import { OmitType } from "@nestjs/swagger";
import { ProjectModel } from "./project-model";

export class CreateProjectDto extends OmitType(ProjectModel, [
  "id",
  "isHidden",
  "workspaceId",
  "members",
]) {}
