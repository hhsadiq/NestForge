import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoemTagAbstractRepository } from '@src/poem-tags/infrastructure/persistence/poem-tag.abstract.repository';

import { PoemTagRelationalRepository } from './repositories/poem-tag.repository';
import { PoemTagEntity } from './entities/poem-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoemTagEntity])],
  providers: [
    {
      provide: PoemTagAbstractRepository,
      useClass: PoemTagRelationalRepository,
    },
  ],
  exports: [PoemTagAbstractRepository],
})
export class RelationalPoemTagPersistenceModule {}
