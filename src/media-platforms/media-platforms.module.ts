import { Module } from '@nestjs/common';

import { MediaPlatformsService } from './media-platforms.service';
import { MediaPlatformsController } from './media-platforms.controller';
import { RelationalMediaPlatformPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalMediaPlatformPersistenceModule],
  controllers: [MediaPlatformsController],
  providers: [MediaPlatformsService],
  exports: [MediaPlatformsService, RelationalMediaPlatformPersistenceModule],
})
export class MediaPlatformsModule {}
