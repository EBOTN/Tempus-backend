import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user-dto";
import { UserModel } from "./user-model.dto";

export class UpdateUserDto extends PartialType(
  OmitType(UserModel, ["id", "avatar", "password"])
) {}
