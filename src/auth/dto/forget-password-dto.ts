import { PickType } from "@nestjs/swagger";
import { AuthUserDto } from "./auth-user-dto";

export class ForgetPasswordDto extends PickType(AuthUserDto, ["email"]) {}
