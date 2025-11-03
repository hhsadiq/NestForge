import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const roles: Array<Pick<RoleEntity, 'name' | 'description'>> = [
      { name: 'Admin', description: 'System administrator with full access' },
      { name: 'User', description: 'Regular application user' },
    ];

    for (const r of roles) {
      const exists = await this.repository.existsBy({ name: r.name });
      if (!exists) {
        await this.repository.save(this.repository.create(r));
      }
    }
  }
}
