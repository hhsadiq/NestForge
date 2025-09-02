import { ApiProperty } from '@nestjs/swagger';

import { Comment } from '@src/comments/domain/comment';
import { Tag } from '@src/tags/domain/tag';
import { User } from '@src/users/domain/user';
import { NullableType } from '@src/utils/types/nullable.type';

export class Article {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty({
    type: Number,
  })
  authorId: number | string;

  @ApiProperty()
  author: User;

  @ApiProperty()
  comments: Comment[];

  @ApiProperty({
    type: [String],
  })
  tagList?: NullableType<Tag['name'][]>;

  // @custom-inject-point
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
