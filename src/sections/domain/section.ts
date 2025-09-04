import { ApiProperty } from '@nestjs/swagger';

export class Section {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  bookId: number;

  @ApiProperty({
    type: Number,
    example: 3,
    required: false,
  })
  parentSectionId?: number;

  @ApiProperty({
    type: String,
    example: 'Chapter 1',
    required: false,
  })
  title?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  position: number;

  @ApiProperty({
    type: String,
    example: 'chapter-1',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
