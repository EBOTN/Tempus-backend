import { Roles } from "@prisma/client";
import { UserDto } from "src/user/dto/user-dto";

export class RawMemberData {
  role: Roles;
  member: UserDto;
}
