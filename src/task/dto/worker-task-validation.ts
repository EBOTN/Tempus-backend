import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class WorkerTaskValidation{
    @ApiProperty({ description: "Array workers are assigned to created task" })
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    readonly workerId:number
}