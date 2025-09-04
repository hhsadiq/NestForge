import { ApiProperty } from '@nestjs/swagger';

export class Language {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'en',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: String,
    example: 'English',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'ltr',
    required: true,
  })
  direction: string;

  @ApiProperty({
    type: String,
    example: 'english',
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
