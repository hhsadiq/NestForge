import { ApiProperty } from '@nestjs/swagger';

export class Tag {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Love',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'love',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'Romantic poetry',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
