import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateSectionDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  bookId: number;

  @ApiProperty({
    type: Number,
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentSectionId?: number;

  @ApiProperty({
    type: String,
    example: 'Chapter 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    type: String,
    example: 'chapter-1',
    required: true,
  })
  @IsString()
  slug: string;
}
