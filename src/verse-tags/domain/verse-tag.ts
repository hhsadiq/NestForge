import { ApiProperty } from '@nestjs/swagger';

export class VerseTag {
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
    example: 3,
    required: true,
  })
  tagId: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
