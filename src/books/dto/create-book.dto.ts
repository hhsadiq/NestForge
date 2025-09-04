import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({
    type: String,
    example: 'Ulysses',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  originalLanguageId?: number;

  @ApiProperty({
    type: String,
    example: 'A modernist novel.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: Number,
    example: 1922,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  publishedYear?: number;

  @ApiProperty({
    type: String,
    example: 'ulysses',
    required: true,
  })
  @IsString()
  slug: string;
}
