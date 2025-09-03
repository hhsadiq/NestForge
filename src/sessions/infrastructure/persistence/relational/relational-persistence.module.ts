import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionAbstractRepository } from '@src/sessions/infrastructure/persistence/session.abstract.repository';

import { SessionEntity } from './entities/session.entity';
import { SessionRelationalRepository } from './repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionAbstractRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionAbstractRepository],
})
export class RelationalSessionPersistenceModule {}
