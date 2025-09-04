import { ApiProperty } from '@nestjs/swagger';

export class ReviewFeedback {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  reviewId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  feedbackPresetId: number;

  @ApiProperty({
    type: String,
    example: 'Good attention to original text.',
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
