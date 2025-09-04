import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedbackPresetAbstractRepository } from '@src/feedback-presets/infrastructure/persistence/feedback-preset.abstract.repository';

import { FeedbackPresetRelationalRepository } from './repositories/feedback-preset.repository';
import { FeedbackPresetEntity } from './entities/feedback-preset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackPresetEntity])],
  providers: [
    {
      provide: FeedbackPresetAbstractRepository,
      useClass: FeedbackPresetRelationalRepository,
    },
  ],
  exports: [FeedbackPresetAbstractRepository],
})
export class RelationalFeedbackPresetPersistenceModule {}
