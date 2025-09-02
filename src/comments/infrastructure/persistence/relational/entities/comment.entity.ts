import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { TABLES } from '@src/common/constants';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.comment,
})
export class CommentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  article_id: string;

  @Column({ type: 'int' })
  author_id: number;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'text' })
  body: string;

  // @custom-inject-point
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
