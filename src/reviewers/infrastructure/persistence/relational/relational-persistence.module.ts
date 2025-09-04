import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewerAbstractRepository } from '@src/reviewers/infrastructure/persistence/reviewer.abstract.repository';

import { ReviewerRelationalRepository } from './repositories/reviewer.repository';
import { ReviewerEntity } from './entities/reviewer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewerEntity])],
  providers: [
    {
      provide: ReviewerAbstractRepository,
      useClass: ReviewerRelationalRepository,
    },
  ],
  exports: [ReviewerAbstractRepository],
})
export class RelationalReviewerPersistenceModule {}
