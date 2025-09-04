import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

import {} from 'class-transformer';

export class CreateStanzaDto {
  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  @IsNumber()
  poemId: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parentStanzaId?: number;

  @ApiProperty({
    type: String,
    example: 'Stanza 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNumber()
  position: number;
}
