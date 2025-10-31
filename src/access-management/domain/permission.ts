import { ApiProperty } from '@nestjs/swagger';

import { Subject } from '@src/access-management/domain/subject';
import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';

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
  action: PermissionActionEnum;

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
