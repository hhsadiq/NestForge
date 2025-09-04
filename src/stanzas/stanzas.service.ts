import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateStanzaDto } from './dto/create-stanza.dto';
import { UpdateStanzaDto } from './dto/update-stanza.dto';
import { StanzaAbstractRepository } from './infrastructure/persistence/stanza.abstract.repository';
import { Stanza } from './domain/stanza';

@Injectable()
export class StanzasService {
  constructor(private readonly stanzaRepository: StanzaAbstractRepository) {}

  create(createStanzaDto: CreateStanzaDto) {
    return this.stanzaRepository.create(createStanzaDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.stanzaRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Stanza['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Stanza['id'], updateStanzaDto: UpdateStanzaDto) {
    const stanza = this.stanzaRepository.update(id, updateStanzaDto);
    if (!stanza) {
      throw NOT_FOUND('Stanza', { id });
    }
    return stanza;
  }

  remove(id: Stanza['id']) {
    return this.stanzaRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.stanzaRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on stanza repository.`,
        field,
      );
    }

    const stanza = await this.stanzaRepository[repoFunction](value);
    if (!stanza) {
      throw NOT_FOUND('Stanza', { [field]: value });
    }
    return stanza;
  }
}
