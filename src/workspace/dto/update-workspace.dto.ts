import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from "@nestjs/swagger";
import { CreateWorkspaceDto } from "./create-workspace.dto";
import { WorkspaceModel } from "./workspace-model";

export class UpdateWorkspaceDto extends 
  PartialType(CreateWorkspaceDto) {}
