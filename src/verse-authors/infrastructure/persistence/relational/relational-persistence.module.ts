import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerseAuthorAbstractRepository } from '@src/verse-authors/infrastructure/persistence/verse-author.abstract.repository';

import { VerseAuthorRelationalRepository } from './repositories/verse-author.repository';
import { VerseAuthorEntity } from './entities/verse-author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerseAuthorEntity])],
  providers: [
    {
      provide: VerseAuthorAbstractRepository,
      useClass: VerseAuthorRelationalRepository,
    },
  ],
  exports: [VerseAuthorAbstractRepository],
})
export class RelationalVerseAuthorPersistenceModule {}
