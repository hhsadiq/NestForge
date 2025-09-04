import { ApiProperty } from '@nestjs/swagger';

export class Paragraph {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  sectionId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  languageId?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  position: number;

  @ApiProperty({
    type: String,
    example: 'It was a bright cold day in April...',
    required: true,
  })
  body: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
