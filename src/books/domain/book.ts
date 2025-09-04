import { ApiProperty } from '@nestjs/swagger';

export class Book {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Ulysses',
    required: true,
  })
  title: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  originalLanguageId?: number;

  @ApiProperty({
    type: String,
    example: 'A modernist novel.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: Number,
    example: 1922,
    required: false,
  })
  publishedYear?: number;

  @ApiProperty({
    type: String,
    example: 'ulysses',
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
