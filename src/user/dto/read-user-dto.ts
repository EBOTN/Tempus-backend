import { OmitType } from "@nestjs/swagger";
import { UserModel } from "./user-model.dto";

export class ReadUserDto extends OmitType(UserModel, ["password"]) {}
