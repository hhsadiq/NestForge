import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtPayloadType } from '@src/auth/strategies/types/jwt-payload.type';
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { UsersService } from '@src/users/users.service';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { Comment } from './domain/comment';
import { CommentAbstractRepository } from './infrastructure/persistence/comment.abstract.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentAbstractRepository,
    private userService: UsersService,
  ) {}

  async create(
    articleId: Comment['articleId'],
    body: Comment['body'],
    userJwtPayload: JwtPayloadType,
  ) {
    const clonedPayload = {
      articleId,
      body,
      authorId: userJwtPayload.id,
    };

    const comment = await this.commentRepository.create(clonedPayload);

    const user = await this.userService.findById(userJwtPayload.id);

    if (user) {
      comment.author = user;
    }

    return comment;
  }

  findAllWithPagination({
    paginationOptions,
    articleId,
  }: {
    paginationOptions: IPaginationOptions;
    articleId: Comment['articleId'];
  }) {
    return this.commentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      articleId,
    });
  }

  async remove(id: Comment['id'], userJwtPayload: JwtPayloadType) {
    const comment = await this.findAndValidate('id', id);

    if (comment?.author?.id !== userJwtPayload.id) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        errors: {
          id: 'Not unauthorized to delete the comment',
        },
      });
    }

    return this.commentRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // captilize first letter of the field name
    if (typeof this.commentRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on comment repository.`,
        field,
      );
    }

    const comment = await this.commentRepository[repoFunction](value);
    if (!comment) {
      throw NOT_FOUND('Comment', { [field]: value });
    }
    return comment;
  }
}
