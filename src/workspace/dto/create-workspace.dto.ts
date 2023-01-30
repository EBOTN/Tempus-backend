import { OmitType } from "@nestjs/swagger";

import { WorkspaceModel } from "./workspace-model";

export class CreateWorkspaceDto extends OmitType(WorkspaceModel, [
  "id",
  "ownerId",
  "cover",
]) {}
