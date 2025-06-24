import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClapAbstractRepository } from '@src/claps/infrastructure/persistence/clap.abstract.repository';

import { ClapEntity } from './entities/clap.entity';
import { ClapRelationalRepository } from './repositories/clap.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClapEntity])],
  providers: [
    {
      provide: ClapAbstractRepository,
      useClass: ClapRelationalRepository,
    },
  ],
  exports: [ClapAbstractRepository],
})
export class RelationalClapPersistenceModule {}
