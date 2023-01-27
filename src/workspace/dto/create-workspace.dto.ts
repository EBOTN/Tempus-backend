import { OmitType } from "@nestjs/swagger";
import { WorkSpaceModel } from "./workspace-model";

export class CreateWorkspaceDto extends OmitType(WorkSpaceModel, ['id', 'ownerId']) {}
