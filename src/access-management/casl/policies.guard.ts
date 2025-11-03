import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccessManagementService } from '@src/access-management/access-management.service';

import { CaslAbilityFactory } from './casl-ability.factory';
import {
  CHECK_ABILITY_KEY,
  CheckAbilityPayload,
} from './check-ability.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessService: AccessManagementService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const meta = this.reflector.getAllAndOverride<CheckAbilityPayload>(
      CHECK_ABILITY_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!meta) return true;
    const user = req.user;
    if (!user?.id) return false;

    const roleIds = Array.isArray(user.roles)
      ? user.roles.map((r: { id: number; name: string }) => r.id)
      : [];

    const permissions = await this.accessService.getUserPermissions(roleIds);
    const ability = this.abilityFactory.createForPermissions(permissions);
    return ability.can(meta.action, meta.subject);
  }
}
