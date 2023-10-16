import { PickType } from "@nestjs/swagger";
import { UserModel } from "./user-model.dto";

export class ChangeUserMailDto extends PickType(UserModel, ["email"]) {}
