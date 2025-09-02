import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentPathParamDto {
  @ApiProperty()
  @IsString()
  slug: string;
}
