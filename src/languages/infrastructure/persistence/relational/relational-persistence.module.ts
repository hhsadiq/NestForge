import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LanguageAbstractRepository } from '@src/languages/infrastructure/persistence/language.abstract.repository';

import { LanguageRelationalRepository } from './repositories/language.repository';
import { LanguageEntity } from './entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageEntity])],
  providers: [
    {
      provide: LanguageAbstractRepository,
      useClass: LanguageRelationalRepository,
    },
  ],
  exports: [LanguageAbstractRepository],
})
export class RelationalLanguagePersistenceModule {}
