import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 3,
    required: true,
  })
  translationId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  reviewerId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  workflowStatusId: number;

  @ApiProperty({
    type: String,
    example: 'Needs more references.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: Date,
    example: '2023-06-23T18:32:09',
    required: false,
  })
  closedAt?: Date;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
