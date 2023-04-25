import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  Equals,
} from "class-validator";

export class GetProjectQuerry {
  @ApiProperty({
    example: 10,
    description: "Offset of projects",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly offset?: number;

  @ApiProperty({
    example: 20,
    description: "Limit of projects",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly limit?: number;

  @ApiProperty({
    example: "all",
    description: "own|others|all",
    required: false,
  })
  @IsOptional()
  @Equals("showHidden")
  readonly filter?: string;

  @ApiProperty({ example: 1, description: "Project title", required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  // @ApiProperty({
  //   example: 1,
  //   description: "Show hidden projects",
  //   required: false,
  // })
  // @IsOptional()
  // @IsIn(["true", "false", true, false], {
  //   message: "isHidden must be one of the following values: true, false",
  // })
  // @Transform(({ value }) => {
  //   if (value === "true") return true;
  //   if (value === "false") return false;
  //   return value;
  // })
  // readonly isHidden?: boolean;
}
