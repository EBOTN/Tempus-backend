import { ApiProperty, OmitType } from "@nestjs/swagger";
import { MemberDto } from "src/shared/member-dto";
import { UserDto } from "src/user/dto/user-dto";
import { WorkspaceModel } from "./workspace-model";

class CountDto {
  @ApiProperty({ description: "Members count", example: 5 })
  members: number;
  @ApiProperty({ description: "Project count", example: 12 })
  projects: number;
}

export class WorkspaceDto extends OmitType(WorkspaceModel, [
  "ownerId",
  "coverFile",
]) {
  @ApiProperty({ description: "Workspace owner", type: UserDto })
  readonly owner: UserDto;

  @ApiProperty({ description: "Workspace members", type: [MemberDto] })
  readonly members: MemberDto[];

  @ApiProperty({
    description: "Count of members and projects",
    type: CountDto,
  })
  readonly count: CountDto;
}
