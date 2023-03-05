import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "@prisma/client";
import { UserDto } from "src/user/dto/user-dto";


export class MemberDto extends UserDto {
    @ApiProperty({description: "Member role"})
    readonly role: Roles
}