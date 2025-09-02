import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

import { ArticleEntity } from './article.entity';

@Entity({
  name: TABLES.articleFollow,
})
export class FavoriteArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, { eager: true })
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
