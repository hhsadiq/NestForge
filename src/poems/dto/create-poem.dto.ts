import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreatePoemDto {
  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  sectionId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  languageId?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    type: String,
    example: 'My Ghazal',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    type: String,
    example: 'my-ghazal',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  poemFormId?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  meterId?: number;
}
