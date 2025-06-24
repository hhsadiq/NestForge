import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { Clap } from './domain/clap';
import { CreateClapDto } from './dto/create-clap.dto';
import { UpdateClapDto } from './dto/update-clap.dto';
import { ClapAbstractRepository } from './infrastructure/persistence/clap.abstract.repository';

@Injectable()
export class ClapsService {
  constructor(private readonly clapRepository: ClapAbstractRepository) {}

  async create(createClapDto: CreateClapDto): Promise<Clap> {
    const existingClap =
      await this.clapRepository.findByCreateClapDto(createClapDto);
    if (existingClap) {
      return existingClap;
    }
    return this.clapRepository.create(createClapDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.clapRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Clap['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Clap['id'], updateClapDto: UpdateClapDto) {
    const clap = this.clapRepository.update(id, updateClapDto);
    if (!clap) {
      throw NOT_FOUND('Clap', { id });
    }
    return clap;
  }

  remove(id: Clap['id']) {
    return this.clapRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.clapRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on clap repository.`,
        field,
      );
    }

    const clap = await this.clapRepository[repoFunction](value);
    if (!clap) {
      throw NOT_FOUND('Clap', { [field]: value });
    }
    return clap;
  }

  async getCountByArticleId(article_id: string): Promise<number> {
    return this.clapRepository.getCountByArticleId(article_id);
  }
}
