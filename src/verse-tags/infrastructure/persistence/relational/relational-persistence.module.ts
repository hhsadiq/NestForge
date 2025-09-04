import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerseTagAbstractRepository } from '@src/verse-tags/infrastructure/persistence/verse-tag.abstract.repository';

import { VerseTagRelationalRepository } from './repositories/verse-tag.repository';
import { VerseTagEntity } from './entities/verse-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerseTagEntity])],
  providers: [
    {
      provide: VerseTagAbstractRepository,
      useClass: VerseTagRelationalRepository,
    },
  ],
  exports: [VerseTagAbstractRepository],
})
export class RelationalVerseTagPersistenceModule {}
