import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepo: Repository<SubjectEntity>,
    @InjectRepository(ActionEntity)
    private readonly actionRepo: Repository<ActionEntity>,
  ) {}

  async run() {
    const subjectNames = ['User', 'AccessManagement'];
    const actionNames = ['create', 'read', 'update', 'delete'];

    // Load all required actions
    const actions = await this.actionRepo.find({
      where: actionNames.map((name) => ({ name })),
    });
    const actionMap = new Map(actions.map((a) => [a.name, a]));

    for (const subjectName of subjectNames) {
      const subject = await this.subjectRepo.findOne({
        where: { name: subjectName },
      });
      if (!subject) {
        continue; // Subject should be created by SubjectSeedService
      }

      for (const actionName of actionNames) {
        const action = actionMap.get(actionName);
        if (!action) {
          continue; // Action should be created by ActionSeedService
        }

        const exists = await this.permissionRepo.count({
          where: {
            subject_id: subject.id,
            action_id: action.id,
          },
        });
        if (!exists) {
          await this.permissionRepo.save(
            this.permissionRepo.create({
              subject_id: subject.id,
              action_id: action.id,
            }),
          );
        }
      }
    }
  }
}
