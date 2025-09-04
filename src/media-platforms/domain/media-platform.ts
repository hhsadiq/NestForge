import { ApiProperty } from '@nestjs/swagger';

export class MediaPlatform {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'yt',
    required: true,
  })
  code: string;

  @ApiProperty({
    type: String,
    example: 'YouTube',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'youtube',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'https://youtube.com/',
    required: false,
  })
  baseUrl?: string;

  @ApiProperty({
    type: String,
    example: 'Video library',
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
