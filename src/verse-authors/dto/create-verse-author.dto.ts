import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateVerseAuthorDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  verseId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  authorId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    type: String,
    example: 'Interpreter',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
}
