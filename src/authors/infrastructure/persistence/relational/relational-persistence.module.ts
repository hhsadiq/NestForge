import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorAbstractRepository } from '@src/authors/infrastructure/persistence/author.abstract.repository';

import { AuthorRelationalRepository } from './repositories/author.repository';
import { AuthorEntity } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  providers: [
    {
      provide: AuthorAbstractRepository,
      useClass: AuthorRelationalRepository,
    },
  ],
  exports: [AuthorAbstractRepository],
})
export class RelationalAuthorPersistenceModule {}
