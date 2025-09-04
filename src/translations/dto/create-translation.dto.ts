import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  IsOptional,
} from 'class-validator';

import {} from 'class-transformer';

export class CreateTranslationDto {
  @ApiProperty({
    type: Number,
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  paragraphId?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  verseId?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  languageId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  translatorId: number;

  @ApiProperty({
    type: String,
    example: 'It was a bright cold day in April...',
    required: true,
  })
  @IsString()
  body: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  version: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty({
    type: String,
    example: 'First edition translation.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  workflowStatusId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sourceTranslationId?: number;

  @ApiProperty({
    type: Object,
    example: '{"llm": "gpt-4"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  generationMeta?: Record<string, any>;
}
