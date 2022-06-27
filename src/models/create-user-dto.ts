import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "test@test.ru", description: "Email" })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: "Kevin", description: "User firstname" })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ example: "Klein", description: "User lastname" })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ example: "123153", description: "User password" })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
