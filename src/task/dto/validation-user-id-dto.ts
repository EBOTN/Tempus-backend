import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ValidationUserIdDto{
    @ApiProperty({description: "User id", example: 1})
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    readonly userId: number
}