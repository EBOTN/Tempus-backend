import { OmitType } from "@nestjs/swagger";
import { UserModel } from "./user-model.dto";

export class CreateUserDto extends OmitType(UserModel, [
  "id",
  "avatarFile",
  "avatar",
]) {}
