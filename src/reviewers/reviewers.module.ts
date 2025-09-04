import { Module } from '@nestjs/common';

import { ReviewersService } from './reviewers.service';
import { ReviewersController } from './reviewers.controller';
import { RelationalReviewerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalReviewerPersistenceModule],
  controllers: [ReviewersController],
  providers: [ReviewersService],
  exports: [ReviewersService, RelationalReviewerPersistenceModule],
})
export class ReviewersModule {}
