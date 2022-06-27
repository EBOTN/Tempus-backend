import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  Length,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "test@test.ru", description: "Email" })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: "Kevin", description: "User firstname" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  readonly firstName: string;

  @ApiProperty({ example: "Klein", description: "User lastname" })
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  readonly lastName: string;

  @ApiProperty({ example: "123153", description: "User password" })
  @IsString()
  @IsNotEmpty()
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {message: "Invalid password"})
  @Length(3, 15)
  readonly password: string;
}
