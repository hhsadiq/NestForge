import { Stanza } from '@src/stanzas/domain/stanza';
import { StanzaEntity } from '@src/stanzas/infrastructure/persistence/relational/entities/stanza.entity';

export class StanzaMapper {
  static toDomain(raw: StanzaEntity): Stanza {
    const domainEntity = new Stanza();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.poemId = raw.poem_id;

    domainEntity.parentStanzaId = raw.parent_stanza_id;

    domainEntity.label = raw.label;

    domainEntity.position = raw.position;

    return domainEntity;
  }

  static toPersistence(domainEntity: Stanza): StanzaEntity {
    const persistenceEntity = new StanzaEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.poem_id = domainEntity.poemId;

    persistenceEntity.parent_stanza_id = domainEntity.parentStanzaId;

    persistenceEntity.label = domainEntity.label;

    persistenceEntity.position = domainEntity.position;

    return persistenceEntity;
  }
}
