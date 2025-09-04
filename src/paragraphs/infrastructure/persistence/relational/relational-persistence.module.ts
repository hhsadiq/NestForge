import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParagraphAbstractRepository } from '@src/paragraphs/infrastructure/persistence/paragraph.abstract.repository';

import { ParagraphRelationalRepository } from './repositories/paragraph.repository';
import { ParagraphEntity } from './entities/paragraph.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParagraphEntity])],
  providers: [
    {
      provide: ParagraphAbstractRepository,
      useClass: ParagraphRelationalRepository,
    },
  ],
  exports: [ParagraphAbstractRepository],
})
export class RelationalParagraphPersistenceModule {}
