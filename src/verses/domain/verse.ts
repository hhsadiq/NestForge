import { ApiProperty } from '@nestjs/swagger';

export class Verse {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  stanzaId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  position: number;

  @ApiProperty({
    type: String,
    example: 'A verse line.',
    required: true,
  })
  body: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  coupletIndex?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  positionInCouplet?: number;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
