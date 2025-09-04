import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParagraphTagAbstractRepository } from '@src/paragraph-tags/infrastructure/persistence/paragraph-tag.abstract.repository';

import { ParagraphTagRelationalRepository } from './repositories/paragraph-tag.repository';
import { ParagraphTagEntity } from './entities/paragraph-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParagraphTagEntity])],
  providers: [
    {
      provide: ParagraphTagAbstractRepository,
      useClass: ParagraphTagRelationalRepository,
    },
  ],
  exports: [ParagraphTagAbstractRepository],
})
export class RelationalParagraphTagPersistenceModule {}
