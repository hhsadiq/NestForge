import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';

@Injectable()
export class ActionSeedService {
  constructor(
    @InjectRepository(ActionEntity)
    private readonly repository: Repository<ActionEntity>,
  ) {}

  async run() {
    const actions = [
      { name: 'manage', description: 'Full management access' },
      { name: 'create', description: 'Create new resources' },
      { name: 'read', description: 'Read/view resources' },
      { name: 'update', description: 'Update existing resources' },
      { name: 'delete', description: 'Delete resources' },
    ];

    for (const { name, description } of actions) {
      const exists = await this.repository.existsBy({ name });
      if (!exists) {
        await this.repository.save(
          this.repository.create({ name, description }),
        );
      }
    }
  }
}
