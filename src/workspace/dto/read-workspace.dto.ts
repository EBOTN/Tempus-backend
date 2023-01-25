import { ApiProperty, OmitType } from "@nestjs/swagger";
import { ReadUserDto } from "src/user/dto/read-user-dto";
import { WorkSpaceModel } from "./workspace-model";

export class ReadWorkSpaceDto extends OmitType(WorkSpaceModel, ["ownerId"]) {
  @ApiProperty({ description: "Workspace owner" })
  readonly owner: ReadUserDto;

  @ApiProperty({ description: "Workspace members" })
  readonly members: { member: ReadUserDto }[];
}
