import { ApiProperty } from '@nestjs/swagger';

export class WorkflowStatus {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'pending',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: String,
    example: 'Pending',
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: String,
    example: 'Awaiting approval',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
