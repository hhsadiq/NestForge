import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerseAbstractRepository } from '@src/verses/infrastructure/persistence/verse.abstract.repository';

import { VerseRelationalRepository } from './repositories/verse.repository';
import { VerseEntity } from './entities/verse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerseEntity])],
  providers: [
    {
      provide: VerseAbstractRepository,
      useClass: VerseRelationalRepository,
    },
  ],
  exports: [VerseAbstractRepository],
})
export class RelationalVersePersistenceModule {}
