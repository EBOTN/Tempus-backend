import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReportDto {
  @ApiProperty({
    description: "Date from"
  })
  @IsDate()
  @Type(() => Date)
  readonly dateFrom: Date;

  @ApiProperty({
    description: "Date to"
  })
  @IsDate()
  @Type(() => Date)
  readonly dateTo: Date;

  @ApiProperty({
    description: "User id"
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly userId: number;

  @ApiProperty({
    description: "Workspace id"
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly workspaceId: number;

  @ApiProperty({
    description: "Project id"
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly projectId?: number;

  @ApiProperty({
    description: "Task id"
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly taskId?: number;
}
