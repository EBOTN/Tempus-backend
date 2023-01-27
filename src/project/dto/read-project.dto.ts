import { OmitType } from "@nestjs/swagger";
import { ProjectModel } from "./project-model";

export class ProjectDto extends OmitType(ProjectModel, ['workspaceId']){
}