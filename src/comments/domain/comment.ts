import { ApiProperty } from '@nestjs/swagger';

import { User } from '@src/users/domain/user';

export class Comment {
  @ApiProperty({
    type: String,
  })
  id: string;

  articleId: string;

  authorId: number | string;

  @ApiProperty()
  body: string;

  // @custom-inject-point
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  author: User;
}
