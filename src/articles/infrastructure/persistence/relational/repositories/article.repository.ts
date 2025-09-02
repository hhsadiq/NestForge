import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

import { ArticleDTOWithTagDomains } from '@src/articles/articles.types';
import { Article } from '@src/articles/domain/article';
import { FavoriteArticle } from '@src/articles/domain/favorite-article';
import { ArticleAbstractRepository } from '@src/articles/infrastructure/persistence/article.abstract.repository';
import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { FavoriteArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/favorite-article.entity';
import { ArticleMapper } from '@src/articles/infrastructure/persistence/relational/mappers/article.mapper';
import { FavoriteArticleMapper } from '@src/articles/infrastructure/persistence/relational/mappers/favorite.article.mapper';
import { User } from '@src/users/domain/user';
import { UserFollowEntity as UserFollowEntity } from '@src/users/infrastructure/persistence/relational/entities/user-follow.entity';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class ArticleRelationalRepository implements ArticleAbstractRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FavoriteArticleEntity)
    private readonly favoriteArticleRepository: Repository<FavoriteArticleEntity>,
    @InjectRepository(UserFollowEntity)
    private readonly userFollowRepository: Repository<UserFollowEntity>,
  ) {}

  async create(data: ArticleDTOWithTagDomains): Promise<Article> {
    const persistenceModel =
      ArticleMapper.toPersistenceFromDTOWithTagDomains(data);

    const newEntity = await this.articleRepository.save(
      this.articleRepository.create(persistenceModel),
    );

    return ArticleMapper.toDomain(newEntity);
  }

  async findPaginatedArticlesWithUserId({
    paginationOptions: { limit, page },
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: User['id'];
  }): Promise<Article[]> {
    const options: FindManyOptions<FavoriteArticleEntity> = {
      where: { user: { id: Number(userId) } },
      take: limit,
      skip: (page - 1) * limit,
      order: { created_at: 'DESC' },
      relations: ['article'],
    };

    const entities = await this.favoriteArticleRepository.find(options);
    return entities.map((entity) => ArticleMapper.toDomain(entity.article));
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Article[]> {
    const entities = await this.articleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: {
        author: true,
        tagList: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return entities.map((entity) => ArticleMapper.toDomain(entity));
  }

  async findAllWithPaginationStandard({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<[Article[], number]> {
    const [entities, total] = await this.articleRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: {
        author: true,
        tagList: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    const data: Article[] = entities.map((entity) =>
      ArticleMapper.toDomain(entity),
    );
    return [data, total];
  }

  async findById(id: Article['id']): Promise<NullableType<Article>> {
    const entity = await this.articleRepository.findOne({
      where: { id },
    });

    return entity ? ArticleMapper.toDomain(entity) : null;
  }

  async findByIdWithRelations(
    id: Article['id'],
  ): Promise<NullableType<Article>> {
    const entity = await this.articleRepository.findOne({
      where: { id },
      relations: {
        author: true,
        tagList: true,
      },
    });

    return entity ? ArticleMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: Article['slug']): Promise<NullableType<Article>> {
    const entity = await this.articleRepository.findOne({
      where: { slug },
    });

    return entity ? ArticleMapper.toDomain(entity) : null;
  }

  async update(entity: Article, payload: Partial<Article>): Promise<Article> {
    const updatedEntity = await this.articleRepository.save(
      this.articleRepository.create(
        ArticleMapper.toPersistence({
          ...entity,
          ...payload,
        }),
      ),
    );

    return ArticleMapper.toDomain(updatedEntity);
  }

  async remove(id: Article['id']): Promise<void> {
    await this.articleRepository.delete(id);
  }

  async createFavorite(data: FavoriteArticle): Promise<FavoriteArticle> {
    const persistenceModel = FavoriteArticleMapper.toPersistence(data);
    const newEntity = await this.favoriteArticleRepository.save(
      this.favoriteArticleRepository.create(persistenceModel),
    );
    return FavoriteArticleMapper.toDomain(newEntity);
  }

  async findFavorite(
    userId: User['id'],
    articleId: Article['id'],
  ): Promise<NullableType<FavoriteArticle>> {
    const entity = await this.favoriteArticleRepository.findOne({
      where: {
        user: { id: Number(userId) },
        article: { id: articleId },
      },
      relations: ['user', 'article'],
    });
    return entity ? FavoriteArticleMapper.toDomain(entity) : null;
  }

  async removeFavorite(id: FavoriteArticle['id']): Promise<void> {
    await this.favoriteArticleRepository.delete(id);
  }
}
