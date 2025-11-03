import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { PermissionActionType } from '@src/access-management/types/permission-actions.type';

export type AppAbility = MongoAbility<[PermissionActionType, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForPermissions(
    permissions: { action: PermissionActionType; subject: string }[],
  ): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    for (const p of permissions) {
      can(p.action, p.subject);
    }

    return build();
  }
}
