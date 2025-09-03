import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';

import { EnableBiometricDto } from '@src/biometric-challenges/dtos/enable-biometric-payload.dto';
import { User } from '@src/users/domain/user';
import { UserDevice } from '@src/users/domain/user-device';
import { FilterUserDto, SortUserDto } from '@src/users/dto/query-user.dto';
import { UserDeviceEntity } from '@src/users/infrastructure/persistence/relational/entities/user-device.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserDeviceMapper } from '@src/users/infrastructure/persistence/relational/mappers/user-device.mapper';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserAbstractRepository } from '@src/users/infrastructure/persistence/user.abstract.repository';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';
import { UserSummaryMapper } from '@src/views/infrastructure/persistence/relational/mappers/user.summary.mapper';

@Injectable()
export class UsersRelationalRepository implements UserAbstractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserDeviceEntity)
    private readonly userDevicesRepository: Repository<UserDeviceEntity>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.usersRepository.save(
      this.usersRepository.create(persistenceModel),
    );
    return UserMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (filterOptions?.roles?.length) {
      where.role = filterOptions.roles.map((role) => ({
        id: role.id,
      }));
    }

    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((user) => UserMapper.toDomain(user));
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const entity = await this.usersRepository.findOne({
      where: { email },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByUsername(
    username: User['username'],
  ): Promise<NullableType<User>> {
    if (!username) return null;

    const entity = await this.usersRepository.findOne({
      where: { username },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySocialIdAndProvider({
    socialId,
    provider,
  }: {
    socialId: User['socialId'];
    provider: User['provider'];
  }): Promise<NullableType<User>> {
    if (!socialId || !provider) return null;

    const entity = await this.usersRepository.findOne({
      where: { social_id: socialId, provider },
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      throw new Error('User not found');
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async getUserSummary(
    id: User['id'],
    query: SelectQueryBuilder<UserSummaryViewEntity>,
  ): Promise<NullableType<UserSummary>> {
    const summary = await query.where({ id: Number(id) }).getOne();
    return summary ? UserSummaryMapper.toDomain(summary) : null;
  }

  async findDeviceByUserIdAndDeviceId(
    id: User['id'],
    deviceId: UserDevice['deviceId'],
  ): Promise<NullableType<UserDevice>> {
    try {
      const entity = await this.userDevicesRepository.findOne({
        where: {
          user: { id: Number(id) },
          device_id: deviceId,
        },
      });

      return entity ? UserDeviceMapper.toDomain(entity) : null;
    } catch (error) {
      throw error;
    }
  }

  async createUserDevice(userDevice: UserDevice): Promise<UserDevice> {
    try {
      const persistenceModel = UserDeviceMapper.toPersistence(userDevice);
      const newEntity = await this.userDevicesRepository.save(
        this.userDevicesRepository.create(persistenceModel),
      );
      return UserDeviceMapper.toDomain(newEntity);
    } catch (error) {
      throw error;
    }
  }

  async addBiometricKeyInUserDevice(
    userDevice: UserDevice,
    enableBiometricDto: EnableBiometricDto,
  ): Promise<NullableType<UserDevice>> {
    try {
      const updatedUserDevice = await this.userDevicesRepository.save(
        this.userDevicesRepository.create(
          UserDeviceMapper.toPersistence({
            ...userDevice,
            user: { id: Number(enableBiometricDto.userId) } as User,
            biometricPublicKey: enableBiometricDto.biometricPublicKey,
          }),
        ),
      );
      return UserDeviceMapper.toDomain(updatedUserDevice);
    } catch (error) {
      throw error;
    }
  }

  async removeBiometricKeyInUserDevice(
    userDevice: UserDevice,
  ): Promise<NullableType<UserDevice>> {
    try {
      const updatedUserDevice = await this.userDevicesRepository.save(
        this.userDevicesRepository.create(
          UserDeviceMapper.toPersistence({
            ...userDevice,
            biometricPublicKey: '',
          }),
        ),
      );
      return UserDeviceMapper.toDomain(updatedUserDevice);
    } catch (error) {
      throw error;
    }
  }
}
