import { Subject } from '@src/access-management/domain/subject';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';

export class SubjectMapper {
  static toDomain(raw: SubjectEntity): Subject {
    const domainEntity = new Subject();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    return domainEntity;
  }

  static toPersistence(domainEntity: Subject): SubjectEntity {
    const persistenceEntity = new SubjectEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    return persistenceEntity;
  }
}
