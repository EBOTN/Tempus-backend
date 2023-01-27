import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUserPasswordDto {
  @ApiProperty({ description: "Current password" })
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @ApiProperty({ description: "New password" })
  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
}
