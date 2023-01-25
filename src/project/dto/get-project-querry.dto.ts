import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class GetProjectQuerry {
  @ApiProperty({
    example: 10,
    description: 'Offset of projects',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly offset?: number;

  @ApiProperty({
    example: 20,
    description: 'Limit of projects',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @ApiProperty({ example: 1, description: 'Project owner', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly owner?: string;

  @ApiProperty({ example: 1, description: 'Project title', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  @ApiProperty({
    example: 1,
    description: 'Show hidden projects',
    required: false,
  })
  @IsOptional()
  @IsIn(['true', 'false', true, false],{message: 'isHidden must be one of the following values: true, false'})
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  readonly isHidden?: boolean;
}
