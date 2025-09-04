import { Verse } from '@src/verses/domain/verse';
import { VerseEntity } from '@src/verses/infrastructure/persistence/relational/entities/verse.entity';

export class VerseMapper {
  static toDomain(raw: VerseEntity): Verse {
    const domainEntity = new Verse();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.stanzaId = raw.stanza_id;

    domainEntity.position = raw.position;

    domainEntity.body = raw.body;

    domainEntity.coupletIndex = raw.couplet_index;

    domainEntity.positionInCouplet = raw.position_in_couplet;

    return domainEntity;
  }

  static toPersistence(domainEntity: Verse): VerseEntity {
    const persistenceEntity = new VerseEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.stanza_id = domainEntity.stanzaId;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.body = domainEntity.body;

    persistenceEntity.couplet_index = domainEntity.coupletIndex;

    persistenceEntity.position_in_couplet = domainEntity.positionInCouplet;

    return persistenceEntity;
  }
}
