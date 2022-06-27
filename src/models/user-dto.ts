import { ApiProperty } from "@nestjs/swagger";

export class userDTO {
  @ApiProperty({ example: "1", description: "Unique identificator" })
  id: number;

  @ApiProperty({ example: "test@test.com", description: "Email" })
  email: string;

  @ApiProperty({ example: "Mike", description: "User firstname" })
  firstName: string;

  @ApiProperty({ example: "Vazovsky", description: "User lastname" })
  lastName: string;

  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
  }
}
