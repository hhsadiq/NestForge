import { ApiProperty } from '@nestjs/swagger';

export class Translation {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 3,
    required: false,
  })
  paragraphId?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  verseId?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  languageId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  translatorId: number;

  @ApiProperty({
    type: String,
    example: 'It was a bright cold day in April...',
    required: true,
  })
  body: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  version: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    required: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    type: String,
    example: 'First edition translation.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  workflowStatusId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  sourceTranslationId?: number;

  @ApiProperty({
    type: Object,
    example: {
      llm: 'gpt-4',
    },
    required: false,
  })
  generationMeta?: Record<string, any>;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
