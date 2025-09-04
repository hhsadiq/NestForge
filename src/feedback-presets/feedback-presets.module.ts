import { Module } from '@nestjs/common';

import { FeedbackPresetsService } from './feedback-presets.service';
import { FeedbackPresetsController } from './feedback-presets.controller';
import { RelationalFeedbackPresetPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalFeedbackPresetPersistenceModule],
  controllers: [FeedbackPresetsController],
  providers: [FeedbackPresetsService],
  exports: [FeedbackPresetsService, RelationalFeedbackPresetPersistenceModule],
})
export class FeedbackPresetsModule {}
