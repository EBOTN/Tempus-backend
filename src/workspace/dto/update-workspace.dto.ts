import { OmitType, PartialType } from "@nestjs/swagger";
import { WorkspaceModel } from "./workspace-model";

export class UpdateWorkspaceDto extends PartialType(
  OmitType(WorkspaceModel, ["id", "cover"])
) {}
