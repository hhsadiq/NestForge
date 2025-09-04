import { ApiProperty } from '@nestjs/swagger';

export class Author {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
  })
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'Doe, John',
    required: false,
  })
  sortName?: string;

  @ApiProperty({
    type: String,
    example: 'A noted contemporary author.',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    type: String,
    example: 'john-doe',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'john@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
