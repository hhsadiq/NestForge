import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentAbstractRepository } from '@src/comments/infrastructure/persistence/comment.abstract.repository';

import { CommentEntity } from './entities/comment.entity';
import { CommentRelationalRepository } from './repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [
    {
      provide: CommentAbstractRepository,
      useClass: CommentRelationalRepository,
    },
  ],
  exports: [CommentAbstractRepository],
})
export class RelationalCommentPersistenceModule {}
