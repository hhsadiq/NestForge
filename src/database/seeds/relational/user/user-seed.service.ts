import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { StatusEnum } from '@src/statuses/statuses.enum';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const ensureRole = async (userId: number, roleName: string) => {
      const rows = await this.repository.query(
        'SELECT id FROM role WHERE name = $1 LIMIT 1',
        [roleName],
      );
      const roleId: number | undefined = rows?.[0]?.id;
      if (roleId) {
        await this.repository.query(
          'INSERT INTO user_role (user_id, role_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM user_role WHERE user_id = $1 AND role_id = $2)',
          [userId, roleId],
        );
      }
    };

    const countAdmin = await this.repository.count({
      where: { email: 'admin@example.com' },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const admin = await this.repository.save(
        this.repository.create({
          first_name: 'Super',
          last_name: 'Admin',
          email: 'admin@example.com',
          username: 'admin_user',
          password,
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
      await ensureRole(admin.id, 'Admin');
    }

    const countUser = await this.repository.count({
      where: { email: 'john.doe@example.com' },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const user = await this.repository.save(
        this.repository.create({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          username: 'john_06',
          password,
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
      await ensureRole(user.id, 'User');
    }
  }
}
