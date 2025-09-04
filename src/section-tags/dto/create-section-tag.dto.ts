import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import {} from 'class-transformer';

export class CreateSectionTagDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  sectionId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  tagId: number;
}
