import { ApiProperty } from '@nestjs/swagger';

export class FeedbackPreset {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'accuracy',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: String,
    example: 'Accuracy',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Checks if translation matches the source.',
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
