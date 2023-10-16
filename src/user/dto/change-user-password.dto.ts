import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class ChangeUserPasswordDto {
  @ApiProperty({ description: "Current password" })
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @ApiProperty({ description: "New password" })
  @IsNotEmpty()
  @IsString()
  @Matches(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
    message:
      "Password must be at least 6 characters long and contain at least one lowercase and one uppercase letter",
  })
  @Length(3, 15)
  readonly newPassword: string;
}
