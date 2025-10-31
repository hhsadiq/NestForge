import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepo: Repository<SubjectEntity>,
  ) {}

  async run() {
    const subjectNames = ['User', 'AccessManagement'];
    const actions: PermissionActionEnum[] = [
      PermissionActionEnum.create,
      PermissionActionEnum.read,
      PermissionActionEnum.update,
      PermissionActionEnum.delete,
    ];

    for (const subjectName of subjectNames) {
      let subject = await this.subjectRepo.findOne({
        where: { name: subjectName },
      });
      if (!subject) {
        subject = await this.subjectRepo.save(
          this.subjectRepo.create({ name: subjectName }),
        );
      }

      for (const action of actions) {
        const exists = await this.permissionRepo.count({
          where: { action, subject: { id: subject.id } as any },
        });
        if (!exists) {
          await this.permissionRepo.save(
            this.permissionRepo.create({ action, subject }),
          );
        }
      }
    }
  }
}
