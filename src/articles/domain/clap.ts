import { ApiProperty } from '@nestjs/swagger';
import { User } from '@src/users/domain/user';
import { Article } from './article';

export class Clap {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Number,
  })
  counter: number;

  @ApiProperty()
  user: User;

  @ApiProperty()
  article: Article;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
