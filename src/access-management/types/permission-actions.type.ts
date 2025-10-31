import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';

export type PermissionActionType =
  (typeof PermissionActionEnum)[keyof typeof PermissionActionEnum];
