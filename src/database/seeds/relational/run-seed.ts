import { NestFactory } from '@nestjs/core';

import { ActionSeedService } from './action/action-seed.service';
import { PermissionSeedService } from './permission/permission-seed.service';
import { RoleSeedService } from './role/role-seed.service';
import { RolePermissionSeedService } from './role-permission/role-permission-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { SubjectSeedService } from './subject/subject-seed.service';
import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(ActionSeedService).run();
  await app.get(SubjectSeedService).run();
  await app.get(PermissionSeedService).run();
  await app.get(RolePermissionSeedService).run();
  await app.get(UserSeedService).run();

  await app.close();
};

void runSeed();
