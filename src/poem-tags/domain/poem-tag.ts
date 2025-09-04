import { ApiProperty } from '@nestjs/swagger';

export class PoemTag {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  poemId: number;

  @ApiProperty({
    type: Number,
    example: 2,
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
