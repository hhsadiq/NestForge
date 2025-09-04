import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

import { CreateMeterDto } from './dto/create-meter.dto';
import { UpdateMeterDto } from './dto/update-meter.dto';
import { MeterAbstractRepository } from './infrastructure/persistence/meter.abstract.repository';
import { Meter } from './domain/meter';

@Injectable()
export class MetersService {
  constructor(private readonly meterRepository: MeterAbstractRepository) {}

  create(createMeterDto: CreateMeterDto) {
    return this.meterRepository.create(createMeterDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.meterRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Meter['id']) {
    return this.findAndValidate('id', id);
  }

  update(id: Meter['id'], updateMeterDto: UpdateMeterDto) {
    const meter = this.meterRepository.update(id, updateMeterDto);
    if (!meter) {
      throw NOT_FOUND('Meter', { id });
    }
    return meter;
  }

  remove(id: Meter['id']) {
    return this.meterRepository.remove(id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.meterRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on meter repository.`,
        field,
      );
    }

    const meter = await this.meterRepository[repoFunction](value);
    if (!meter) {
      throw NOT_FOUND('Meter', { [field]: value });
    }
    return meter;
  }
}
