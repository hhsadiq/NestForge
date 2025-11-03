import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { SubjectSeedService } from '@src/database/seeds/relational/subject/subject-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectSeedService],
  exports: [SubjectSeedService],
})
export class SubjectSeedModule {}
