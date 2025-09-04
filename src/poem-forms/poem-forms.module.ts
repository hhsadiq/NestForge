import { Module } from '@nestjs/common';

import { PoemFormsService } from './poem-forms.service';
import { PoemFormsController } from './poem-forms.controller';
import { RelationalPoemFormPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPoemFormPersistenceModule],
  controllers: [PoemFormsController],
  providers: [PoemFormsService],
  exports: [PoemFormsService, RelationalPoemFormPersistenceModule],
})
export class PoemFormsModule {}
