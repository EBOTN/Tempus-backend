import { ApiProperty } from "@nestjs/swagger";

export class userDTO {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  readonly id: number;

  @ApiProperty({ example: "test@test.com", description: "Email" })
  readonly email: string;

  @ApiProperty({ example: "Mike", description: "User firstname" })
  readonly firstName: string;

  @ApiProperty({ example: "Vazovsky", description: "User lastname" })
  readonly lastName: string;
}
