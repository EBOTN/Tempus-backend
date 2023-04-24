import { ApiProperty } from "@nestjs/swagger";
import { Roles } from "@prisma/client";

export class GetRoleDto {
  @ApiProperty({ description: "User role", enum: Roles, enumName: "Role" })
  readonly role: string;
}
