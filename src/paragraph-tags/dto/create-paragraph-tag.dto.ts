import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import {} from 'class-transformer';

export class CreateParagraphTagDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  paragraphId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  tagId: number;
}
