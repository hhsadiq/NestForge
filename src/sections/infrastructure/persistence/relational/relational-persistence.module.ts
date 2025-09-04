import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SectionAbstractRepository } from '@src/sections/infrastructure/persistence/section.abstract.repository';

import { SectionRelationalRepository } from './repositories/section.repository';
import { SectionEntity } from './entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity])],
  providers: [
    {
      provide: SectionAbstractRepository,
      useClass: SectionRelationalRepository,
    },
  ],
  exports: [SectionAbstractRepository],
})
export class RelationalSectionPersistenceModule {}
