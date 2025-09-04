import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateReviewerDto {
  @ApiProperty({
    type: String,
    example: 'Dr. Mira',
    required: true,
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'mira@example.com',
    required: true,
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  translatorId?: number;

  @ApiProperty({
    type: String,
    example: 'Specializes in poetry review.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
