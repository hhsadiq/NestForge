import { Clap } from '@src/claps/domain/clap';
import { CreateClapDto } from '@src/claps/dto/create-clap.dto';
import { ClapEntity } from '@src/claps/infrastructure/persistence/relational/entities/clap.entity';

export class ClapMapper {
  static toDomain(raw: ClapEntity): Clap {
    const domainEntity = new Clap();
    domainEntity.articleId = raw.article_id;

    domainEntity.userId = raw.user_id;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Clap): ClapEntity {
    const persistenceEntity = new ClapEntity();
    persistenceEntity.article_id = domainEntity.articleId;

    persistenceEntity.user_id = domainEntity.userId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static createClapDtoToPersistence(createClapDto: CreateClapDto): {
    user_id: number;
    article_id: string;
  } {
    const { userId, articleId } = createClapDto;
    return {
      user_id: userId,
      article_id: articleId,
    };
  }
}
