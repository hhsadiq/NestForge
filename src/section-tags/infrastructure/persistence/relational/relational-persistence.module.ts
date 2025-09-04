import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SectionTagAbstractRepository } from '@src/section-tags/infrastructure/persistence/section-tag.abstract.repository';

import { SectionTagRelationalRepository } from './repositories/section-tag.repository';
import { SectionTagEntity } from './entities/section-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionTagEntity])],
  providers: [
    {
      provide: SectionTagAbstractRepository,
      useClass: SectionTagRelationalRepository,
    },
  ],
  exports: [SectionTagAbstractRepository],
})
export class RelationalSectionTagPersistenceModule {}
