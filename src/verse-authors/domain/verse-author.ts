import { ApiProperty } from '@nestjs/swagger';

export class VerseAuthor {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  verseId: number;

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
    example: 'Interpreter',
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
