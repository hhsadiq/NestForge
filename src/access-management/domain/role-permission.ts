import { ApiProperty } from '@nestjs/swagger';

import { Permission } from '@src/access-management/domain/permission';
import { Role } from '@src/access-management/domain/role';

export class RolePermission {
  @ApiProperty({
    type: () => Role,
  })
  role: Role;

  @ApiProperty({
    type: () => Permission,
  })
  permission: Permission;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the role permission was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the role permission was last updated',
  })
  updatedAt: Date;
}
