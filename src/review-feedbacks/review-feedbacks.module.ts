import { Module } from '@nestjs/common';

import { ReviewFeedbacksService } from './review-feedbacks.service';
import { ReviewFeedbacksController } from './review-feedbacks.controller';
import { RelationalReviewFeedbackPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalReviewFeedbackPersistenceModule],
  controllers: [ReviewFeedbacksController],
  providers: [ReviewFeedbacksService],
  exports: [ReviewFeedbacksService, RelationalReviewFeedbackPersistenceModule],
})
export class ReviewFeedbacksModule {}
