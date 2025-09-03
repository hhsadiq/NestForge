import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { User } from '@src/users/domain/user';
import { NullableType } from '@src/utils/types/nullable.type';

import { Session } from './domain/session';
import { SessionAbstractRepository } from './infrastructure/persistence/session.abstract.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionAbstractRepository) {}

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.findAndValidate('id', id);
  }

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const updatedEntity = this.sessionRepository.update(id, payload);
    if (!updatedEntity) {
      throw NOT_FOUND('session', { id });
    }
    return updatedEntity;
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions);
  }

  deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // captilize first letter of the field name
    if (typeof this.sessionRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on session repository.`,
        field,
      );
    }

    const session = await this.sessionRepository[repoFunction](value);
    if (!session) {
      throw NOT_FOUND('session', { [field]: value });
    }
    return session;
  }
}
