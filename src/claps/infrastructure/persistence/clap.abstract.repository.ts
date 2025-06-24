import { Clap } from '@src/claps/domain/clap';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

export abstract class ClapAbstractRepository {
  abstract create(
    data: Omit<Clap, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Clap>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Clap[]>;

  abstract findById(id: Clap['id']): Promise<NullableType<Clap>>;

  abstract update(
    id: Clap['id'],
    payload: DeepPartial<Clap>,
  ): Promise<Clap | null>;

  abstract remove(id: Clap['id']): Promise<void>;

  abstract findByCreateClapDto(createClapDto): Promise<Clap | null>;

  abstract getCountByArticleId(article_id: string): Promise<number>;
}
