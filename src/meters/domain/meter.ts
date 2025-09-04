import { ApiProperty } from '@nestjs/swagger';

export class Meter {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Beher-e-ramal',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'ramal',
    required: true,
  })
  slug: string;

  @ApiProperty({
    type: String,
    example: 'A traditional poetic meter.',
    required: false,
  })
  note?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  fileId: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
