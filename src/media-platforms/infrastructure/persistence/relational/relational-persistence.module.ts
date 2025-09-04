import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaPlatformAbstractRepository } from '@src/media-platforms/infrastructure/persistence/media-platform.abstract.repository';

import { MediaPlatformRelationalRepository } from './repositories/media-platform.repository';
import { MediaPlatformEntity } from './entities/media-platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaPlatformEntity])],
  providers: [
    {
      provide: MediaPlatformAbstractRepository,
      useClass: MediaPlatformRelationalRepository,
    },
  ],
  exports: [MediaPlatformAbstractRepository],
})
export class RelationalMediaPlatformPersistenceModule {}
