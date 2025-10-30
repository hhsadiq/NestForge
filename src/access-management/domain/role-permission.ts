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
}
