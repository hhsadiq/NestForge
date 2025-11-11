import { ApiProperty } from '@nestjs/swagger';

export class Action {
  @ApiProperty({
    type: Number,
    description: 'Unique identifier for the action',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Name of the action (e.g., create, read, update, delete)',
    example: 'create',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of what the action allows',
    nullable: true,
    example: 'Create new resources',
  })
  description?: string;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the action was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the action was last updated',
  })
  updatedAt: Date;
}
