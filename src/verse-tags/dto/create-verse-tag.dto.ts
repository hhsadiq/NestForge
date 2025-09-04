import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import {} from 'class-transformer';

export class CreateVerseTagDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  verseId: number;

  @ApiProperty({
    type: Number,
    example: 3,
    required: true,
  })
  @IsNumber()
  tagId: number;
}
