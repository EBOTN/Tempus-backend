import { OmitType, PartialType } from "@nestjs/swagger";
import { WorkSpaceModel } from "./workspace-model";

export class UpdateWorkspaceDto extends PartialType(
  OmitType(WorkSpaceModel, ["id", "cover"])
) {}
