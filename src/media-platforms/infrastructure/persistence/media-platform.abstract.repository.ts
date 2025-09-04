import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { MediaPlatform } from '@src/media-platforms/domain/media-platform';

export abstract class MediaPlatformAbstractRepository {
  abstract create(
    data: Omit<MediaPlatform, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MediaPlatform>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MediaPlatform[]>;

  abstract findById(
    id: MediaPlatform['id'],
  ): Promise<NullableType<MediaPlatform>>;

  abstract update(
    id: MediaPlatform['id'],
    payload: DeepPartial<MediaPlatform>,
  ): Promise<MediaPlatform | null>;

  abstract remove(id: MediaPlatform['id']): Promise<void>;
}
