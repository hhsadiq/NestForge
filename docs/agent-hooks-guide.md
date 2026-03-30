# Agent Hooks System — Implementation Guide

This document covers the three-tier context injection system implemented for **NestForge**.
It shows exactly what happens without the system versus with it, using real patterns from this codebase.

> Based on: [Hook-Based Context Injection for AI Coding Agents](https://andrewpatterson.dev/posts/agent-convention-enforcement-system/) by Andrew Patterson.

---

## Table of Contents

1. [What the System Is](#what-the-system-is)
2. [How Each Tier Works](#how-each-tier-works)
3. [The Real Problem: Convention Drift](#the-real-problem-convention-drift)
4. [Token Cost: Does This Use More Tokens?](#token-cost-does-this-use-more-tokens)
5. [Side-by-Side Examples](#side-by-side-examples)
   - [Example 1: New Service Method](#example-1-new-service-method)
   - [Example 2: New Domain Entity](#example-2-new-domain-entity)
   - [Example 3: New Repository Method](#example-3-new-repository-method)
   - [Example 4: New Controller Endpoint](#example-4-new-controller-endpoint)
   - [Example 5: Wrong File Placement](#example-5-wrong-file-placement)
6. [Violation Categories](#violation-categories)
7. [Files Created by This System](#files-created-by-this-system)
7. [How to Test the System](#how-to-test-the-system)
8. [Extending the System](#extending-the-system)

---

## What the System Is

A three-tier enforcement system that keeps AI agents aligned with this project's hexagonal
architecture conventions across sessions, models, and agents.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Tier 1: Hot Memory (AGENTS.md — loaded every session)               │
│   Layer map, dependency rules, import aliases, NEVER list           │
│   ~150 lines. Always present regardless of task.                    │
├──────────────────────────────────────────────────────────────────────┤
│ Tier 2: Cold Memory (docs/layers/ + docs/cross-cutting/)            │
│   Layer-specific conventions, canonical examples, landmines         │
│   ~30-60 lines per doc. Injected only when editing that layer.      │
├──────────────────────────────────────────────────────────────────────┤
│ Tier 3: Runtime Enforcement (hooks — every Edit/Write)              │
│   PreToolUse: inject-context.mjs                                    │
│     1. structureCheck — blocks new files in wrong dirs (Write)      │
│     2. codeContext — injects ALL matching layer docs before edit     │
│   PostToolUse: arch-validate.sh                                     │
│     grep checks after edit, exit 2 blocks on violation              │
└──────────────────────────────────────────────────────────────────────┘
```

Without this system: ~40% convention compliance (documentation alone). Violations compound
across sessions — one agent's wrong pattern becomes the next agent's reference.

With this system: violations are blocked or self-corrected before they land in git.

---

## How Each Tier Works

### Tier 1: AGENTS.md (hot memory)

Loaded at session start via Claude Code's AGENTS.md detection. Contains:
- Complete layer map with folder structure
- Dependency rules (which layers can import from which)
- The `@src/` import alias
- Error handling (`@src/common/exceptions` — never raw NestJS exceptions)
- Pagination patterns (two helpers: `infinityPagination` vs `pagination`)
- The mapper pattern (always static, always called on read)
- NEVER list (hard blockers)
- Routing table pointing to leaf docs

This is what the agent knows before it starts. The problem: as conversation grows, AGENTS.md
sinks into the "lost-in-the-middle" zone of the context window and loses influence.

### Tier 2: Cold Memory (leaf docs in docs/layers/ and docs/cross-cutting/)

Each doc has two sections:
- `## Inject` — 20-50 lines, auto-injected by the hook right before the agent edits
- `## Reference` — full detail, for humans and on-demand agent reads

Injection fires at the highest-attention moment: just before the edit. Twenty focused lines
here outperform 200 lines read 20 minutes ago.

Docs created for this project:
```
docs/layers/
  index.md         ← phonebook
  domain.md        ← pure TS entities, no DB deps
  service.md       ← abstract repo injection, exception helpers, pagination
  repository.md    ← abstract + concrete, mapper requirement, single-responsibility
  mapper.md        ← static toDomain/toPersistence, camelCase↔snake_case
  controller.md    ← decorators, pagination defaults, two response shapes
  dto.md           ← naming, validation decorators, FindAll pattern
docs/cross-cutting/
  file-placement.md ← module internal structure, blocked paths
  exceptions.md     ← all helpers with examples
```

### Tier 3: Runtime Enforcement

**PreToolUse** (`scripts/inject-context.mjs`): runs before every Edit and Write.
- **structureCheck**: on Write to new files — blocks creation in wrong directories
- **codeContext**: all-matches routing — every matching doc injects, not just the first

**PostToolUse** (`scripts/arch-validate.sh`): runs after every Edit and Write.
- grep checks on the modified file
- Exit 2 blocks the agent from proceeding until the violation is fixed

Together: PreToolUse teaches and prevents. PostToolUse enforces. The agent cannot proceed with
a violation in place.

---

## The Real Problem: Convention Drift

This codebase has 20+ modules all following the hexagonal pattern. That pattern has non-obvious rules:

1. Services inject the **abstract repository** (not the concrete one, not TypeORM directly)
2. Domain entities are **pure TypeScript** (zero TypeORM, zero infra imports)
3. Mappers are **always static** and always called before returning from a repo method
4. Errors use **project-specific helpers** (`NOT_FOUND`, not `throw new NotFoundException(...)`)
5. Pagination uses **two different helpers** depending on whether total count is needed
6. **`export default` is not used** — NestJS modules use named exports

None of these are discoverable by reading one file. An agent that hasn't read the architecture
docs reaches for the generic TypeScript/NestJS pattern every time. Over 5 sessions with 3
different agents, that's 5 opportunities to introduce drift.

Each violation becomes precedent: the next agent sees existing code that uses the wrong pattern
and copies it. Drift compounds silently.

---

## Token Cost: Does This Use More Tokens?

Yes — but less than you'd think, and the tradeoff is heavily in your favor.

### What the system adds per edit

Each `## Inject` section is 20-50 lines. A service file edit injects ~4,000 characters
(service doc + exceptions doc), roughly **~1,000 tokens per edit**.

Measured token usage across a 15-file editing session (from the original article):

| Model      | Total tokens | Tool uses | Wall time | Tokens per file |
|------------|--------------|-----------|-----------|-----------------|
| Haiku 4.5  | 136k         | 41        | 2m 37s    | ~9k             |
| Sonnet 4.6 | 72k          | 40        | 3m 23s    | ~4.8k           |

Zero convention violations in both cases.

### What the system saves

The injection cost is **fixed and small**. The cost of drift is **compounding and unbounded**.

| Scenario | Token cost |
|---|---|
| Injecting the right context upfront | ~1,000 tokens per edit |
| Wrong pattern → agent correction → re-attempt loop | 3–5× the injection cost |
| Violation lands in git, found in next session | Entire new session + manual fix |
| One wrong pattern becomes the reference for 5 future edits | 5× drift compounding |

Without injection, agents also spend tokens asking clarifying questions, re-reading docs they
forgot from the start of the session, and producing attempts that get rolled back. Those tokens
are wasted. Injection tokens produce correct output on the first attempt.

### Why injections are cheap compared to corrections

A correction cycle looks like this:
1. Agent writes code with wrong pattern (~500 tokens)
2. PostToolUse fires, blocks with violation message (~50 tokens)
3. Agent reads the error, figures out the right pattern (~200 tokens)
4. Agent rewrites correctly (~500 tokens)

Total: ~1,250 tokens to recover from one violation — more than just injecting upfront.
With 8 violation types enforced, the injection pays for itself on the first blocked violation.

### The real cost of documentation-only (no hooks)

Research measured ~40% convention compliance with documentation alone. In a 30-module
hexagonal codebase, that means roughly 6 out of every 10 cross-layer interactions have a
convention error. Each error is a silent, compounding cost — not a loud, correctable one.

Tokens spent on drift are the most expensive kind: you pay them, get incorrect output, and
only find out later (in review, in production, or when the next agent copies the wrong pattern).

---

## Side-by-Side Examples

### Example 1: New Service Method

**Task**: Add a `findByPropertyId` method to `BookingsService`.

#### Without enforcement

```typescript
// ❌ What an agent writes without context
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { BookingEntity } from './infrastructure/persistence/relational/entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    // ❌ Injecting TypeORM repository directly — bypasses the abstract repo port
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  async findByPropertyId(propertyId: number): Promise<BookingEntity[]> {
    const results = await this.bookingRepo.find({ where: { property_id: propertyId } });

    if (!results.length) {
      // ❌ Raw NestJS exception — not the project helper
      throw new NotFoundException(`No bookings found for property ${propertyId}`);
    }
    // ❌ Returning raw DB entities — exposes snake_case to the calling layer
    return results;
  }
}
```

**Problems**:
- Service directly injects TypeORM `Repository<BookingEntity>` — bypasses the hexagonal port
- Returns raw DB entity (`BookingEntity`) instead of domain entity (`Booking`)
- Uses `throw new NotFoundException(...)` instead of `NOT_FOUND('Booking', { propertyId })`
- Exposes `property_id` (snake_case) to the service layer — violates camelCase boundary

**PostToolUse would block** on: `@InjectRepository`, `Repository<BookingEntity>`,
`throw new NotFoundException`.

#### With enforcement

The PreToolUse hook injects `docs/layers/service.md` (and `docs/cross-cutting/exceptions.md`)
before the agent edits. The agent now knows:
- Inject the abstract repository, not TypeORM
- Use `NOT_FOUND` from `@src/common/exceptions`
- The service operates on domain entities, not DB entities

```typescript
// ✅ What the agent writes with context injection
import { Injectable } from '@nestjs/common';

import { NOT_FOUND } from '@src/common/exceptions';

import { Booking } from './domain/booking';
import { BookingAbstractRepository } from './infrastructure/persistence/booking.abstract.repository';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingRepository: BookingAbstractRepository) {}

  async findByPropertyId(propertyId: Booking['propertyId']): Promise<Booking[]> {
    const bookings = await this.bookingRepository.findByPropertyId(propertyId);
    if (!bookings.length) {
      throw NOT_FOUND('Booking', { propertyId });
    }
    return bookings;
  }
}
```

**Violations prevented**: wrong injection pattern, raw exception, snake_case leakage.

---

### Example 2: New Domain Entity

**Task**: Add a `VendorPayoutSchedule` domain entity to the vendor-payouts module.

#### Without enforcement

```typescript
// ❌ What an agent writes without context
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// ❌ TypeORM decorators on a domain entity — domain should be pure TypeScript
@Entity('vendor_payout_schedules')
export class VendorPayoutSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor_id: number;  // ❌ snake_case in domain entity

  @Column({ type: 'decimal' })
  payout_amount: number;  // ❌ snake_case in domain entity

  @Column()
  scheduled_date: Date;  // ❌ snake_case in domain entity
}
```

**Problems**:
- Domain entity has TypeORM decorators — it's supposed to be pure TypeScript
- Uses snake_case property names — domain layer uses camelCase
- This file would make the domain layer depend on TypeORM (wrong dependency direction)

**PostToolUse would block** on: TypeORM imports in a domain file.

#### With enforcement

PreToolUse injects `docs/layers/domain.md`. Agent knows: zero TypeORM, zero infra imports,
camelCase properties only.

```typescript
// ✅ Correct domain entity
export class VendorPayoutSchedule {
  id: number;
  vendorId: number;       // camelCase
  payoutAmount: number;   // camelCase
  scheduledDate: Date;    // camelCase
  createdAt: Date;
  updatedAt: Date;
}
```

**Violations prevented**: TypeORM in domain, snake_case properties, wrong file location.

---

### Example 3: New Repository Method

**Task**: Add `findByVendorId` to the vendor-payouts concrete repository.

#### Without enforcement

```typescript
// ❌ What an agent writes without context
async findByVendorId(vendorId: number) {
  // ❌ Returns raw TypeORM entity — mapper is never called
  return await this.vendorPayoutRepository.find({
    where: { vendor_id: vendorId },
  });
}
```

**Problem**: Raw `VendorPayoutEntity[]` is returned instead of `VendorPayout[]` (domain).
The service layer receives snake_case data. The camelCase boundary is silently broken.
No error is thrown — it just works incorrectly.

**PostToolUse catches this**: concrete repo has `async find` methods but no `.toDomain()` call.

#### With enforcement

PreToolUse injects `docs/layers/repository.md`. Agent knows: always call `Mapper.toDomain()`
before returning, use `NullableType<T>` for single lookups.

```typescript
// ✅ Correct
async findByVendorId(vendorId: VendorPayout['vendorId']): Promise<VendorPayout[]> {
  const entities = await this.vendorPayoutRepository.find({
    where: { vendor_id: vendorId },
  });
  return entities.map((e) => VendorPayoutMapper.toDomain(e));
}
```

**Violations prevented**: unmapped return, wrong return type, silent camelCase boundary break.

---

### Example 4: New Controller Endpoint

**Task**: Add a `GET /bookings/by-property/:propertyId` endpoint.

#### Without enforcement

```typescript
// ❌ What an agent writes without context
@Controller('bookings')
export class BookingsController {
  constructor(
    // ❌ Injecting service correctly, but...
    private readonly bookingsService: BookingsService,
  ) {}

  // ❌ Missing @ApiTags, @ApiBearerAuth, @UseGuards on the class
  // ❌ Missing @ApiParam decorator
  // ❌ No pagination — returns raw unbounded array
  // ❌ No limit cap
  @Get('by-property/:propertyId')
  findByPropertyId(@Param('propertyId') propertyId: number) {
    return this.bookingsService.findByPropertyId(propertyId);
  }
}
```

**Problems**: missing Swagger decorators, no JWT guard, no pagination, no response type annotation.
The endpoint works but breaks Swagger docs and security posture.

#### With enforcement

PreToolUse injects `docs/layers/controller.md`. Agent knows: required decorators, pagination
defaults, limit cap of 50, `@ApiOkResponse` + `@ApiParam`.

```typescript
// ✅ Correct
@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('by-property')
  @ApiOkResponse({ type: InfinityPaginationResponse(Booking) })
  async findByPropertyId(
    @Query() query: FindAllBookingsDto,
  ): Promise<InfinityPaginationResponseDto<Booking>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    return infinityPagination(
      await this.bookingsService.findAllWithPagination({ paginationOptions: { page, limit } }),
      { page, limit },
    );
  }
}
```

**Violations prevented**: missing guards, missing Swagger annotations, unbounded array returns.

---

### Example 5: Wrong File Placement

**Task**: Add a `BookingHelpers` utility with date range validation.

#### Without enforcement

Agent creates: `src/bookings/helpers/booking-helpers.ts`

This is a wrong path. The file is placed outside the hexagonal structure, creates a new
unlisted folder type, and breaks the convention that shared helpers go in `src/utils/`.

No error is thrown. The file just sits there. Next agent copies the pattern.

#### With enforcement

**PreToolUse structureCheck fires on Write** (new file detection):

```
BLOCKED: src/bookings/helpers/booking-helpers.ts
Module-internal helpers go in src/utils/ or src/common/ — not in src/<module>/helpers/.
See docs/cross-cutting/file-placement.md for the full structure.
```

The file is **never created**. The agent must redirect to the correct path:
`src/utils/booking-date-utils.ts` or `src/common/booking-helpers.ts`.

If somehow the file bypasses the PreToolUse check (e.g. via Bash), the PostToolUse
`arch-validate.sh` catches it:

```
Architecture violations in src/bookings/helpers/booking-helpers.ts:
❌ Wrong path: src/<module>/helpers/ — shared helpers go in src/utils/ or src/common/
```

Exit 2 — agent cannot proceed until fixed.

---

## Violation Categories

| Category | What it catches | Tier | Enforcement |
|---|---|---|---|
| Domain imports TypeORM | `typeorm` in `domain/*.ts` | PostToolUse | Blocking (exit 2) |
| Domain imports infra | `infrastructure/` in `domain/*.ts` | PostToolUse | Blocking |
| Service injects TypeORM | `@InjectRepository` in `*.service.ts` | PostToolUse | Blocking |
| Service throws raw exceptions | `throw new NotFoundException` | PostToolUse | Blocking |
| Repo returns raw entities | No `toDomain()` in repo with find methods | PostToolUse | Blocking |
| Repo imports other repos | cross-repo imports | PostToolUse | Blocking |
| Wrong directory (top-level) | `src/services/`, `src/entities/`, etc. | PreToolUse + Post | Blocking |
| Wrong directory (in-module) | `src/<module>/entities/`, `src/<module>/helpers/` | PreToolUse + Post | Blocking |
| `console.log` | Any console.* in src/ | PostToolUse | Blocking |
| `export default` | Named exports only | PostToolUse | Blocking |
| `as any` / `: any` | Untyped values | PostToolUse | Warning only |

---

## Files Created by This System

```
AGENTS.md                                    ← Tier 1: hot memory (loaded every session)

docs/layers/
  index.md                                   ← Phonebook
  domain.md                                  ← Domain entity conventions
  service.md                                 ← Service layer conventions
  repository.md                              ← Abstract + concrete repo conventions
  mapper.md                                  ← Mapper conventions
  controller.md                              ← Controller conventions
  dto.md                                     ← DTO conventions

docs/cross-cutting/
  file-placement.md                          ← Module structure, blocked paths
  exceptions.md                              ← Exception helper reference

scripts/
  inject-context.mjs                         ← PreToolUse hook (orchestrator)
  hooks/
    base.mjs                                 ← buildContext + runPipeline shared utils
    inject-structure-context.mjs             ← structureCheck middleware
    inject-code-context.mjs                  ← codeContext middleware (all-matches routing)
  arch-validate.sh                           ← PostToolUse hook (blocking grep checks)

.claude/settings.json                        ← Hook wiring (committed to git)
```

---

## How to Test the System

### Test 1: Verify inject-context routes correctly

```bash
# Should inject service + exception docs for a service file
echo '{"tool_name":"Edit","tool_input":{"file_path":"'"$(pwd)"'/src/bookings/bookings.service.ts"}}' \
  | CLAUDE_PROJECT_DIR=$(pwd) node scripts/inject-context.mjs 2>/dev/null | \
  node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.hookSpecificOutput?.additionalContext?.substring(0,300))"

# Should inject domain doc for a domain entity
echo '{"tool_name":"Edit","tool_input":{"file_path":"'"$(pwd)"'/src/bookings/domain/booking.ts"}}' \
  | CLAUDE_PROJECT_DIR=$(pwd) node scripts/inject-context.mjs 2>/dev/null | \
  node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.hookSpecificOutput?.additionalContext?.substring(0,300))"
```

### Test 2: Verify structureCheck blocks bad paths

```bash
# Should exit 2 with BLOCKED message
echo '{"tool_name":"Write","tool_input":{"file_path":"src/services/booking.service.ts"}}' \
  | CLAUDE_PROJECT_DIR=$(pwd) node scripts/inject-context.mjs 2>&1; echo "Exit: $?"

echo '{"tool_name":"Write","tool_input":{"file_path":"src/bookings/helpers/utils.ts"}}' \
  | CLAUDE_PROJECT_DIR=$(pwd) node scripts/inject-context.mjs 2>&1; echo "Exit: $?"
```

### Test 3: Verify arch-validate catches violations

```bash
# Create a test file with a violation
echo 'import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class TestService {
  constructor(@InjectRepository(SomeEntity) private repo) {}
}' > /tmp/test-service.ts

echo '{"tool_input":{"file_path":"/tmp/test-service.ts"}}' \
  | CLAUDE_PROJECT_DIR=$(pwd) bash scripts/arch-validate.sh 2>&1; echo "Exit: $?"

rm /tmp/test-service.ts
```

---

## Extending the System

### Adding a new leaf doc

1. Create `docs/layers/<name>.md` with `## Inject` and `## Reference` sections
2. Add routes to `scripts/hooks/inject-code-context.mjs` ROUTES array
3. Update the routing table in `AGENTS.md`

### Adding a new arch-validate check

1. Count existing violations first: `grep -rl 'pattern' src/ | wc -l`
2. Only add the check if existing hits are 0-2 (don't block files with pre-existing violations)
3. Add to the appropriate section in `scripts/arch-validate.sh`
4. Test: create a temp file with the violation and verify exit 2

### Adding a new blocked path

Add to `BLOCKED_PATHS` array in `scripts/hooks/inject-structure-context.mjs`:
```javascript
[/^src\/<module>\/<wrong-folder>\//, 'Guidance message with correct path.'],
```

Mirror the check in `arch-validate.sh` for defense-in-depth.

### Committing settings.json

After any change to `.claude/settings.json`:
```bash
git add .claude/settings.json
git commit -m "chore: update hook configuration"
```

Worktree agents inherit hooks from branch HEAD. Uncommitted changes don't propagate.

---

## References

- [Hook-Based Context Injection for AI Coding Agents](https://andrewpatterson.dev/posts/agent-convention-enforcement-system/) — Andrew Patterson. The original article this system is based on. Covers the three-tier architecture, A/B results, gotchas, and testing protocols in depth.
