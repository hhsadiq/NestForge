import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateVerseDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  stanzaId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    type: String,
    example: 'A verse line.',
    required: true,
  })
  @IsString()
  body: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  coupletIndex?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  positionInCouplet?: number;
}
