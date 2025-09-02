import { SelectQueryBuilder } from 'typeorm';

import { User } from '@src/users/domain/user';
import { FilterUserDto, SortUserDto } from '@src/users/dto/query-user.dto';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';

export abstract class UserAbstractRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findByUsername(
    username: User['username'],
  ): Promise<NullableType<User>>;

  abstract findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;
  abstract getUserSummary(
    id: User['id'],
    query: SelectQueryBuilder<UserSummaryViewEntity>,
  ): Promise<NullableType<UserSummary>>;
}
