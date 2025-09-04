import { ApiProperty } from '@nestjs/swagger';

export class Stanza {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  poemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  parentStanzaId?: number;

  @ApiProperty({
    type: String,
    example: 'Stanza 1',
    required: false,
  })
  label?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  position: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
