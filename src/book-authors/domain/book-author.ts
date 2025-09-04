import { ApiProperty } from '@nestjs/swagger';

export class BookAuthor {
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
    example: 1,
    required: true,
  })
  authorId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  position: number;

  @ApiProperty({
    type: String,
    example: 'Editor',
    required: false,
  })
  role?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
