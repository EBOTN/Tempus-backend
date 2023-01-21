import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ProjectModel } from "./project-model";

export class ReadProjectDto extends OmitType(ProjectModel, ['workspaceId']){
}