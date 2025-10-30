import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
// Subjects are strings from DB; we use string-based subjects for flexibility
export type AppAbility = MongoAbility<[Actions, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForPermissions(
    permissions: { action: Actions; subject: string }[],
  ): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    for (const p of permissions) {
      can(p.action, p.subject);
    }

    return build();
  }
}
