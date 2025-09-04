import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanzaAbstractRepository } from '@src/stanzas/infrastructure/persistence/stanza.abstract.repository';

import { StanzaRelationalRepository } from './repositories/stanza.repository';
import { StanzaEntity } from './entities/stanza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StanzaEntity])],
  providers: [
    {
      provide: StanzaAbstractRepository,
      useClass: StanzaRelationalRepository,
    },
  ],
  exports: [StanzaAbstractRepository],
})
export class RelationalStanzaPersistenceModule {}
