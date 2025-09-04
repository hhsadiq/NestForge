import { ApiProperty } from '@nestjs/swagger';

export class Reviewer {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Dr. Mira',
    required: true,
  })
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'mira@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  translatorId?: number;

  @ApiProperty({
    type: String,
    example: 'Specializes in poetry review.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
