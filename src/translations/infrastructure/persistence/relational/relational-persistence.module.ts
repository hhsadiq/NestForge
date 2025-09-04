import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TranslationAbstractRepository } from '@src/translations/infrastructure/persistence/translation.abstract.repository';

import { TranslationRelationalRepository } from './repositories/translation.repository';
import { TranslationEntity } from './entities/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationEntity])],
  providers: [
    {
      provide: TranslationAbstractRepository,
      useClass: TranslationRelationalRepository,
    },
  ],
  exports: [TranslationAbstractRepository],
})
export class RelationalTranslationPersistenceModule {}
