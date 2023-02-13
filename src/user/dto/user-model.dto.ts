import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  IsNumber,
  IsOptional
} from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";

export class UserModel {
  @ApiProperty({ example: 1, description: "User id" })
  @IsNumber()
  readonly id: number;

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
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, { message: "Invalid password" })
  @Length(3, 15)
  readonly password: string;

  @ApiProperty({
    type: "string",
    required: false,
    format: "binary",
    description: "User avatar (File)",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsFile()
  @HasMimeType(["image/jpeg", "image/png"])
  readonly avatarFile?: MemoryStoredFile;

  @ApiProperty({
    example: "http://.../api/image/image1",
    description: "User avatar (Url)",
  })
  readonly avatar?: string;
}
