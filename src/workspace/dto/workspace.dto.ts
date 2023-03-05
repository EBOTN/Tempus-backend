import { ApiProperty, OmitType } from "@nestjs/swagger";
import { MemberDto } from "src/shared/member-dto";
import { UserDto } from "src/user/dto/user-dto";
import { WorkspaceModel } from "./workspace-model";

export class WorkspaceDto extends OmitType(WorkspaceModel, ["ownerId", "coverFile"]) {
  @ApiProperty({ description: "Workspace owner", type: UserDto })
  readonly owner: UserDto;

  @ApiProperty({ description: "Workspace members", type: [MemberDto] })
  readonly members: MemberDto[];
}
