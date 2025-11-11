import { ApiProperty } from '@nestjs/swagger';

import { Action } from '@src/access-management/domain/action';
import { Subject } from '@src/access-management/domain/subject';

export class Permission {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the permission',
  })
  id: number;

  @ApiProperty({
    type: () => Action,
  })
  action: Action;

  @ApiProperty({
    type: () => Subject,
  })
  subject: Subject;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the permission was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the permission was last updated',
  })
  updatedAt: Date;
}
