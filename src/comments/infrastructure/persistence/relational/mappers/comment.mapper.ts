import { Comment } from '@src/comments/domain/comment';
import { CommentEntity } from '@src/comments/infrastructure/persistence/relational/entities/comment.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class CommentMapper {
  static toDomain(raw: CommentEntity): Comment {
    const domainEntity = new Comment();
    domainEntity.body = raw.body;
    domainEntity.id = raw.id;
    if (raw.author) {
      domainEntity.author = UserMapper.toDomain(raw.author);
    }
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Comment): CommentEntity {
    const persistenceEntity = new CommentEntity();
    persistenceEntity.body = domainEntity.body;
    if (domainEntity.authorId && typeof domainEntity.authorId === 'number') {
      persistenceEntity.author_id = domainEntity.authorId;
    }
    persistenceEntity.article_id = domainEntity.articleId;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
