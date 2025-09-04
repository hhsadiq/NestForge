import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewAbstractRepository } from '@src/reviews/infrastructure/persistence/review.abstract.repository';

import { ReviewRelationalRepository } from './repositories/review.repository';
import { ReviewEntity } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],
  providers: [
    {
      provide: ReviewAbstractRepository,
      useClass: ReviewRelationalRepository,
    },
  ],
  exports: [ReviewAbstractRepository],
})
export class RelationalReviewPersistenceModule {}
