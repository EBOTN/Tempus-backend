import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Roles } from "src/shared/roles-enum";
import { RoleModel } from "./create-role.dto";

export class UpdateRoleDto {
  @IsEnum(Roles)
  readonly role: Roles;
  
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly memberId: number;
}
