# File Placement

Last verified: 2026-03-30

## Inject

Every new file in `src/` must go inside an existing feature module folder, following the hexagonal
structure. There is no `src/utils/`, `src/helpers/`, `src/components/`, or `src/services/` at the
top level — those are wrong placements.

**Module internal structure** (required layout):

```
src/<module>/
├── domain/
│   └── <entity>.ts                          ← Pure TS domain entity
├── domain/queries/
│   └── <query-name>-query.ts                ← Query result shape
├── dto/
│   └── <verb>-<entity(s)>.dto.ts            ← Request/response DTOs
├── enums/
│   └── <name>.enum.ts                       ← TypeScript enums
├── infrastructure/persistence/
│   ├── <module>.abstract.repository.ts      ← Port (abstract class)
│   └── relational/
│       ├── entities/
│       │   └── <entity>.entity.ts           ← TypeORM entity
│       ├── mappers/
│       │   └── <entity>.mapper.ts           ← Static mapper
│       ├── repositories/
│       │   └── <module>.repository.ts       ← Adapter (concrete)
│       ├── queries/
│       │   ├── <module>-queries.const.ts    ← Raw SQL strings
│       │   └── <query>.mapper.ts            ← Query result mapper
│       └── relational-persistence.module.ts
├── <module>.controller.ts
├── <module>.service.ts
└── <module>.module.ts
```

**Blocked placements** — agents often get these wrong:

| Wrong path | Correct path |
|---|---|
| `src/services/<module>.service.ts` | `src/<module>/<module>.service.ts` |
| `src/repositories/<module>.repo.ts` | `src/<module>/infrastructure/persistence/relational/repositories/` |
| `src/<module>/entities/` | `src/<module>/infrastructure/persistence/relational/entities/` |
| `src/<module>/models/` | `src/<module>/domain/` |
| `src/<module>/helpers/` | `src/utils/` or `src/common/` |
| `src/<module>/infrastructure/<entity>.ts` | `src/<module>/infrastructure/persistence/relational/entities/<entity>.entity.ts` |

**Shared utilities** (cross-module, not domain-specific) go in:
- `src/utils/` — generic helpers, pagination, type utilities
- `src/common/` — exceptions, filters, interceptors, decorators
- `src/database-helpers/` — DB utility functions like `runRawQueryOnReadReplica`

**New top-level module**: use `npx hygen resource-entity new` to scaffold correctly.
Do not create a new top-level `src/` directory manually unless you are adding a shared utility
module (utils, common, database-helpers pattern).

Canonical structure reference: `src/bookings/` is the most complete example module.

## Reference

The `src/` directory contains 30+ modules. Each follows identical internal structure.
Consistency is what makes the codebase navigable. When a file is in the wrong place:
1. Other agents reach for it by convention and fail to find it
2. Module boundaries leak — services start depending on each other's internals
3. The hexagonal port/adapter pattern breaks down

If you are unsure where a file belongs, check `src/bookings/` as the reference module.
