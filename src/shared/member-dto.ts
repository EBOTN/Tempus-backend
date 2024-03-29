import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { UserDto } from 'src/user/dto/user-dto';

export class MemberDto extends UserDto {
  @ApiProperty({ description: 'Member role', enum: Roles, enumName: 'Role' })
  readonly role: Roles;
}
