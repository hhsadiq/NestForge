import { Module } from '@nestjs/common';

import { MetersService } from './meters.service';
import { MetersController } from './meters.controller';
import { RelationalMeterPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalMeterPersistenceModule],
  controllers: [MetersController],
  providers: [MetersService],
  exports: [MetersService, RelationalMeterPersistenceModule],
})
export class MetersModule {}
