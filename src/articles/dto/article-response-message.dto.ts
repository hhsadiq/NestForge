import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ArticleResponseMessageDto {
  @ApiProperty({ type: String })
  @IsString()
  message: string;
}
