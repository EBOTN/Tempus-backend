import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthUserDto {
  @ApiProperty({ example: "test@test.ru", description: "Email" })
  @IsEmail()
  readonly email: string;
  @ApiProperty({ example: "123153", description: "User password" })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
