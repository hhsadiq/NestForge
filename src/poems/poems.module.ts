import { Module } from '@nestjs/common';

import { PoemsService } from './poems.service';
import { PoemsController } from './poems.controller';
import { RelationalPoemPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPoemPersistenceModule],
  controllers: [PoemsController],
  providers: [PoemsService],
  exports: [PoemsService, RelationalPoemPersistenceModule],
})
export class PoemsModule {}
