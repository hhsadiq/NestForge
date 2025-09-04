import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  path: string;
}
