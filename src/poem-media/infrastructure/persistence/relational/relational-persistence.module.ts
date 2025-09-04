import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoemMediaAbstractRepository } from '@src/poem-media/infrastructure/persistence/poem-media.abstract.repository';

import { PoemMediaRelationalRepository } from './repositories/poem-media.repository';
import { PoemMediaEntity } from './entities/poem-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoemMediaEntity])],
  providers: [
    {
      provide: PoemMediaAbstractRepository,
      useClass: PoemMediaRelationalRepository,
    },
  ],
  exports: [PoemMediaAbstractRepository],
})
export class RelationalPoemMediaPersistenceModule {}
