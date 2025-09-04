import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewFeedbackAbstractRepository } from '@src/review-feedbacks/infrastructure/persistence/review-feedback.abstract.repository';

import { ReviewFeedbackRelationalRepository } from './repositories/review-feedback.repository';
import { ReviewFeedbackEntity } from './entities/review-feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewFeedbackEntity])],
  providers: [
    {
      provide: ReviewFeedbackAbstractRepository,
      useClass: ReviewFeedbackRelationalRepository,
    },
  ],
  exports: [ReviewFeedbackAbstractRepository],
})
export class RelationalReviewFeedbackPersistenceModule {}
