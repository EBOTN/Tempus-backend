import { IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly firstName: string;
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly lastName: string;
}
