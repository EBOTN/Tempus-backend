import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Roles } from './roles-enum';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'New member role',
    enum: Roles,
    enumName: 'Role',
  })
  @IsEnum(Roles)
  readonly role: Roles;

  @ApiProperty({ description: 'Member id for change role' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly memberId: number;
}
