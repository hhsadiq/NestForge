import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookAbstractRepository } from '@src/books/infrastructure/persistence/book.abstract.repository';

import { BookRelationalRepository } from './repositories/book.repository';
import { BookEntity } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [
    {
      provide: BookAbstractRepository,
      useClass: BookRelationalRepository,
    },
  ],
  exports: [BookAbstractRepository],
})
export class RelationalBookPersistenceModule {}
