import { ApiProperty } from '@nestjs/swagger';

export class Poem {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 2,
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
    example: 'My Ghazal',
    required: false,
  })
  title?: string;

  @ApiProperty({
    type: String,
    example: 'my-ghazal',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  poemFormId?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  meterId?: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
