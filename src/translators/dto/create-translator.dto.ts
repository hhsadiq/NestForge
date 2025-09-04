import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateTranslatorDto {
  @ApiProperty({
    type: String,
    example: 'human',
    required: true,
  })
  @IsString()
  translatorType: string;

  @ApiProperty({
    type: String,
    example: 'Jane Roe',
    required: true,
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'Roe, Jane',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortName?: string;

  @ApiProperty({
    type: String,
    example: 'Human literary translator.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    type: String,
    example: 'Famous for poetic translations.',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: String,
    example: 'jane-roe',
    required: true,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'OpenAI',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmProviderName?: string;

  @ApiProperty({
    type: String,
    example: 'openai',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmProviderSlug?: string;

  @ApiProperty({
    type: String,
    example: 'https://openai.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmProviderWebsite?: string;

  @ApiProperty({
    type: String,
    example: 'gpt-4',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmModelName?: string;

  @ApiProperty({
    type: String,
    example: 'gpt-4',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmModelSlug?: string;

  @ApiProperty({
    type: String,
    example: 'v1.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmModelVersion?: string;

  @ApiProperty({
    type: String,
    example: 'GPT',
    required: false,
  })
  @IsOptional()
  @IsString()
  llmModelFamily?: string;
}
