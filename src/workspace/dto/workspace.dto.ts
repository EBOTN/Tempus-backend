import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UserDto } from "src/user/dto/user-dto";
import { WorkspaceModel } from "./workspace-model";

export class WorkspaceDto extends OmitType(WorkspaceModel, ["ownerId"]) {
  @ApiProperty({ description: "Workspace owner" })
  readonly owner: UserDto;

  @ApiProperty({ description: "Workspace members" })
  readonly members: { member: UserDto }[];
}
