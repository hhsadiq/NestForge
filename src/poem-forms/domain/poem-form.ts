import { ApiProperty } from '@nestjs/swagger';

export class PoemForm {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Ghazal',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'ghazal',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'A rhyming form of poetry.',
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
