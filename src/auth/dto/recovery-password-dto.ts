import { PickType } from "@nestjs/swagger";
import { UserModel } from "src/user/dto/user-model.dto";

export class RecoveryPasswordDto extends PickType(UserModel, ["password"]) {}
