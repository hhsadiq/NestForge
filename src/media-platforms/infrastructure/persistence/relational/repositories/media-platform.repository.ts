import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@src/utils/types/nullable.type';
import { MediaPlatform } from '@src/media-platforms/domain/media-platform';
import { MediaPlatformAbstractRepository } from '@src/media-platforms/infrastructure/persistence/media-platform.abstract.repository';
import { MediaPlatformMapper } from '@src/media-platforms/infrastructure/persistence/relational/mappers/media-platform.mapper';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { MediaPlatformEntity } from '@src/media-platforms/infrastructure/persistence/relational/entities/media-platform.entity';

@Injectable()
export class MediaPlatformRelationalRepository
  implements MediaPlatformAbstractRepository
{
  constructor(
    @InjectRepository(MediaPlatformEntity)
    private readonly mediaPlatformRepository: Repository<MediaPlatformEntity>,
  ) {}

  async create(data: MediaPlatform): Promise<MediaPlatform> {
    const persistenceModel = MediaPlatformMapper.toPersistence(data);
    const newEntity = await this.mediaPlatformRepository.save(
      this.mediaPlatformRepository.create(persistenceModel),
    );
    return MediaPlatformMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MediaPlatform[]> {
    const entities = await this.mediaPlatformRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MediaPlatformMapper.toDomain(entity));
  }

  async findById(
    id: MediaPlatform['id'],
  ): Promise<NullableType<MediaPlatform>> {
    const entity = await this.mediaPlatformRepository.findOne({
      where: { id },
    });

    return entity ? MediaPlatformMapper.toDomain(entity) : null;
  }

  async update(
    id: MediaPlatform['id'],
    payload: Partial<MediaPlatform>,
  ): Promise<MediaPlatform | null> {
    const entity = await this.mediaPlatformRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.mediaPlatformRepository.save(
      this.mediaPlatformRepository.create(
        MediaPlatformMapper.toPersistence({
          ...MediaPlatformMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MediaPlatformMapper.toDomain(updatedEntity);
  }

  async remove(id: MediaPlatform['id']): Promise<void> {
    await this.mediaPlatformRepository.delete(id);
  }
}
