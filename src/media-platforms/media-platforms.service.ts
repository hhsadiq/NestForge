import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateMediaPlatformDto } from './dto/create-media-platform.dto';
import { UpdateMediaPlatformDto } from './dto/update-media-platform.dto';
import { MediaPlatformAbstractRepository } from './infrastructure/persistence/media-platform.abstract.repository';
import { MediaPlatform } from './domain/media-platform';

@Injectable()
export class MediaPlatformsService {
  constructor(
    private readonly mediaPlatformRepository: MediaPlatformAbstractRepository,
  ) {}

  create(createMediaPlatformDto: CreateMediaPlatformDto) {
    return this.mediaPlatformRepository.create(createMediaPlatformDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.mediaPlatformRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: MediaPlatform['id']) {
    return this.findAndValidate('id', id);
  }

  update(
    id: MediaPlatform['id'],
    updateMediaPlatformDto: UpdateMediaPlatformDto,
  ) {
    const mediaPlatform = this.mediaPlatformRepository.update(
      id,
      updateMediaPlatformDto,
    );
    if (!mediaPlatform) {
      throw NOT_FOUND('MediaPlatform', { id });
    }
    return mediaPlatform;
  }

  remove(id: MediaPlatform['id']) {
    return this.mediaPlatformRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.mediaPlatformRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on mediaPlatform repository.`,
        field,
      );
    }

    const mediaPlatform =
      await this.mediaPlatformRepository[repoFunction](value);
    if (!mediaPlatform) {
      throw NOT_FOUND('MediaPlatform', { [field]: value });
    }
    return mediaPlatform;
  }
}
