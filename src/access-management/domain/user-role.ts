import { ApiProperty } from '@nestjs/swagger';

import { Role } from '@src/access-management/domain/role';
import { User } from '@src/users/domain/user';

export class UserRole {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the user role',
  })
  id: number;

  @ApiProperty({
    type: () => User,
  })
  user: User;

  @ApiProperty({
    type: () => Role,
  })
  role: Role;
}
