import { ApiProperty } from '@nestjs/swagger';

import { Subject } from '@src/access-management/domain/subject';
import { PermissionAction } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';

export class Permission {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the permission',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Action of the permission',
    example: 'create',
  })
  action: PermissionAction;

  @ApiProperty({
    type: () => Subject,
  })
  subject: Subject;

  @ApiProperty({
    type: String,
    description: 'Description of what the permission allows',
    nullable: true,
    example: 'Allows creating a new guide entry',
  })
  description?: string;
}
