import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoemFormAbstractRepository } from '@src/poem-forms/infrastructure/persistence/poem-form.abstract.repository';

import { PoemFormRelationalRepository } from './repositories/poem-form.repository';
import { PoemFormEntity } from './entities/poem-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoemFormEntity])],
  providers: [
    {
      provide: PoemFormAbstractRepository,
      useClass: PoemFormRelationalRepository,
    },
  ],
  exports: [PoemFormAbstractRepository],
})
export class RelationalPoemFormPersistenceModule {}
