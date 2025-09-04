import { ApiProperty } from '@nestjs/swagger';

export class Translator {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'human',
    required: true,
  })
  translatorType: string;

  @ApiProperty({
    type: String,
    example: 'Jane Roe',
    required: true,
  })
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'Roe, Jane',
    required: false,
  })
  sortName?: string;

  @ApiProperty({
    type: String,
    example: 'Human literary translator.',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    type: String,
    example: 'Famous for poetic translations.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: String,
    example: 'jane-roe',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'OpenAI',
    required: false,
  })
  llmProviderName?: string;

  @ApiProperty({
    type: String,
    example: 'openai',
    required: false,
  })
  llmProviderSlug?: string;

  @ApiProperty({
    type: String,
    example: 'https://openai.com',
    required: false,
  })
  llmProviderWebsite?: string;

  @ApiProperty({
    type: String,
    example: 'gpt-4',
    required: false,
  })
  llmModelName?: string;

  @ApiProperty({
    type: String,
    example: 'gpt-4',
    required: false,
  })
  llmModelSlug?: string;

  @ApiProperty({
    type: String,
    example: 'v1.0',
    required: false,
  })
  llmModelVersion?: string;

  @ApiProperty({
    type: String,
    example: 'GPT',
    required: false,
  })
  llmModelFamily?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
