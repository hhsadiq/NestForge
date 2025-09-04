import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateFeedbackPresetDto {
  @ApiProperty({
    type: String,
    example: 'accuracy',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    type: String,
    example: 'Accuracy',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Checks if translation matches the source.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
