import { ApiProperty, OmitType } from "@nestjs/swagger";
import { userDTO } from "src/user/dto/user-dto";
import { WorkSpaceModel } from "./workspace-model";

export class ReadWorkSpaceDto extends OmitType(WorkSpaceModel, ['ownerId']){
    @ApiProperty({description: 'Workspace owner'})
    readonly owner: userDTO
}