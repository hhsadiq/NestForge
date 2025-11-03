import { SetMetadata } from '@nestjs/common';

import { PermissionActionType } from '@src/access-management/types/permission-actions.type';

export const CHECK_ABILITY_KEY = 'check_ability';
export type CheckAbilityPayload = {
  action: PermissionActionType;
  subject: string;
};
export const CheckAbility = (payload: CheckAbilityPayload) =>
  SetMetadata(CHECK_ABILITY_KEY, payload);
