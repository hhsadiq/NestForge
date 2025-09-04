import { Module } from '@nestjs/common';

import { StanzasService } from './stanzas.service';
import { StanzasController } from './stanzas.controller';
import { RelationalStanzaPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalStanzaPersistenceModule],
  controllers: [StanzasController],
  providers: [StanzasService],
  exports: [StanzasService, RelationalStanzaPersistenceModule],
})
export class StanzasModule {}
