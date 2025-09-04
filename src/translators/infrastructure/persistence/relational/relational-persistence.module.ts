import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TranslatorAbstractRepository } from '@src/translators/infrastructure/persistence/translator.abstract.repository';

import { TranslatorRelationalRepository } from './repositories/translator.repository';
import { TranslatorEntity } from './entities/translator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranslatorEntity])],
  providers: [
    {
      provide: TranslatorAbstractRepository,
      useClass: TranslatorRelationalRepository,
    },
  ],
  exports: [TranslatorAbstractRepository],
})
export class RelationalTranslatorPersistenceModule {}
