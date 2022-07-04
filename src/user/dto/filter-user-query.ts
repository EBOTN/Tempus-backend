import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class FilterUserQuery {
  @ApiProperty({ example: "1", description: "Task id", required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly taskId: number;

  @ApiProperty({
    example: "1",
    description: "How many users need skip",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly skip: number;

  @ApiProperty({
    example: "1",
    description: "How many users need take",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  readonly take: number;

  @ApiProperty({
    example: "test@test.com",
    description: "Email",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: "Mike",
    description: "User firstname",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly searchText: string;
}
