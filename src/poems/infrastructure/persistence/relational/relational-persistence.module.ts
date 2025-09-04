import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoemAbstractRepository } from '@src/poems/infrastructure/persistence/poem.abstract.repository';

import { PoemRelationalRepository } from './repositories/poem.repository';
import { PoemEntity } from './entities/poem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoemEntity])],
  providers: [
    {
      provide: PoemAbstractRepository,
      useClass: PoemRelationalRepository,
    },
  ],
  exports: [PoemAbstractRepository],
})
export class RelationalPoemPersistenceModule {}
