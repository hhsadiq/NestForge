import { Module } from '@nestjs/common';

import { AccessManagementController } from '@src/access-management/access-management.controller';
import { AccessManagementService } from '@src/access-management/access-management.service';
import { CaslAbilityFactory } from '@src/access-management/casl/casl-ability.factory';
import { PoliciesGuard } from '@src/access-management/casl/policies.guard';
import { RelationalAccessPersistenceModule } from '@src/access-management/infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalAccessPersistenceModule],
  providers: [AccessManagementService, CaslAbilityFactory, PoliciesGuard],
  controllers: [AccessManagementController],
  exports: [AccessManagementService, CaslAbilityFactory, PoliciesGuard],
})
export class AccessManagementModule {}
