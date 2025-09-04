import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import {} from 'class-transformer';

export class CreatePoemTagDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  poemId: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  tagId: number;
}
