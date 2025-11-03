import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';

@Injectable()
export class SubjectSeedService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly repository: Repository<SubjectEntity>,
  ) {}

  async run() {
    const names = ['User', 'AccessManagement'];
    for (const name of names) {
      const exists = await this.repository.existsBy({ name });
      if (!exists) {
        await this.repository.save(this.repository.create({ name }));
      }
    }
  }
}
