import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY_KEY = 'check_ability';
export type CheckAbilityPayload = {
  action: 'manage' | 'create' | 'read' | 'update' | 'delete';
  subject: string;
};
export const CheckAbility = (payload: CheckAbilityPayload) =>
  SetMetadata(CHECK_ABILITY_KEY, payload);
