import { OmitType } from "@nestjs/swagger";
import { UserModel } from "./user-model.dto";

export class UserDto extends OmitType(UserModel, ["password", "avatarFile"]) {}
