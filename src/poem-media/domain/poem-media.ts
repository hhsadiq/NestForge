import { ApiProperty } from '@nestjs/swagger';

export class PoemMedia {
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
    example: 1,
    required: true,
  })
  mediaPlatformId: number;

  @ApiProperty({
    type: String,
    example: 'https://youtube.com/watch?v=xyz123',
    required: true,
  })
  link: string;

  @ApiProperty({
    type: String,
    example: 'Live performance recording.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
