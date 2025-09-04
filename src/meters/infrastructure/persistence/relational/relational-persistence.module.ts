import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeterAbstractRepository } from '@src/meters/infrastructure/persistence/meter.abstract.repository';

import { MeterRelationalRepository } from './repositories/meter.repository';
import { MeterEntity } from './entities/meter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeterEntity])],
  providers: [
    {
      provide: MeterAbstractRepository,
      useClass: MeterRelationalRepository,
    },
  ],
  exports: [MeterAbstractRepository],
})
export class RelationalMeterPersistenceModule {}
