// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(
  OmitType(CreateArticleDto, ['tagList'] as const),
) {}
