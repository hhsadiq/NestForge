# 🛡️ Access Management

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [How Authorization Works](#how-authorization-works)
- [Applying Authorization to a New API](#applying-authorization-to-a-new-api)
  - [1. Define the Required Permission](#1-define-the-required-permission)
  - [2. Ensure the Permission Exists](#2-ensure-the-permission-exists)
  - [3. Build User Abilities](#3-build-user-abilities)
  - [4. Apply Authorization in Controller](#4-apply-authorization-in-controller)
- [How It Works](#how-it-works)
- [Managing Roles and Permissions via API](#managing-roles-and-permissions-via-api)

## Overview

This project implements a flexible and declarative Access Management System using nest-casl.
Authorization is handled through action–subject pairs, e.g.:

- `read:User`
- `create:Guide`
- `update:AccessManagement`

Each user’s roles and permissions are loaded from the database and transformed into a CASL Ability, which determines what actions they are allowed to perform.

## How Authorization Works

- Permissions define what actions (read, create, update, delete) can be performed on which subjects/modules (e.g., User, Guide, etc.).
- Roles group multiple permissions.
- Users are assigned one or more roles.

When a request is made:
- The system builds a CASL Ability for the user based on their assigned roles and permissions.
- The PoliciesGuard checks whether the user’s ability allows the action on the subject.

## Applying Authorization to a New API

When adding authorization to a new controller or endpoint, follow these steps:

### 1. Define the Required Permission

Decide which action and subject pair should protect the endpoint.

For example: Only users with the `{action: "create", subject: "User"}` permission can create new users.

### 2. Ensure the Permission Exists

Check that the corresponding permission exists in the database.
If not, add it via migration/seed or through Access Management APIs.

### 3. Build User Abilities

User abilities are automatically built at runtime using `CaslAbilityFactory` based on their assigned roles and permissions.
You don’t need to modify this logic manually — just ensure permissions are properly stored and assigned.

### 4. Apply Authorization in Controller

Use the provided decorators and guards to protect your endpoint.

```typescript
import { PoliciesGuard } from '@src/access-management/casl/policies.guard';
import { CheckAbility } from '@src/access-management/casl/check-ability.decorator';

@Controller('users')
export class UsersController {
  @ApiBearerAuth()
  @UseGuards(PoliciesGuard)
  @CheckAbility({ action: 'create', subject: 'User' })
  @Post()
  async create(@Req() req: any) {
    // Business logic
  }
}
```


## How It Works
See the controller example above for applying `@CheckAbility` and `PoliciesGuard` to a new endpoint.

- `@CheckAbility({ action, subject })` defines what permission is required to access the route.
- `PoliciesGuard` automatically:
  - Loads the user’s roles and permissions.
  - Builds a CASL Ability using `CaslAbilityFactory`.
  - Checks `ability.can(action, subject)` to allow or deny access.
- If the user lacks the required permission, a 403 Forbidden error is returned.

## Managing Roles and Permissions via API

All endpoints are versioned under `/api/v1/access-management` and require `Authorization: Bearer <token>`.

- Create role

```bash
POST /api/v1/access-management/roles
Content-Type: application/json

{ "name": "Admin" }
```

- Create permission

```bash
POST /api/v1/access-management/permissions
Content-Type: application/json

{ "action": "create", "subject": "User", "description": "Create users" }
```

- Assign permission to role

```bash
PATCH /api/v1/access-management/assign-permission/:roleId/:permissionId
```

- Assign role to user

```bash
PATCH /api/v1/access-management/assign-role/:userId/:roleId
```
---

Previous: [HTTP Module](http.md)

Next: [Auth](auth.md)
