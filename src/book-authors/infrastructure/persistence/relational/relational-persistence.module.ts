import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookAuthorAbstractRepository } from '@src/book-authors/infrastructure/persistence/book-author.abstract.repository';

import { BookAuthorRelationalRepository } from './repositories/book-author.repository';
import { BookAuthorEntity } from './entities/book-author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookAuthorEntity])],
  providers: [
    {
      provide: BookAuthorAbstractRepository,
      useClass: BookAuthorRelationalRepository,
    },
  ],
  exports: [BookAuthorAbstractRepository],
})
export class RelationalBookAuthorPersistenceModule {}
