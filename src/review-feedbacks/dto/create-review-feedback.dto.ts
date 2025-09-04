import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateReviewFeedbackDto {
  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  reviewId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  feedbackPresetId: number;

  @ApiProperty({
    type: String,
    example: 'Good attention to original text.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
