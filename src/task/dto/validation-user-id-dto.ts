import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class ValidationUserIdDto{
    @ApiProperty({description: "User id", example: 1})
    @IsNotEmpty()
    @Type(() => Number)
    readonly userId: number
}