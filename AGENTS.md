# AGENTS.md — NestForge

NestJS hexagonal (Ports & Adapters) architecture. 20+ feature modules, each with identical internal structure. This file is loaded every session — keep it loaded and trust it.

---

## Layer Map

```
src/<module>/
├── domain/                                          ← Pure TS classes, NO DB decorators
│   ├── <entity>.ts                                  ← camelCase props, no imports from infra
│   └── queries/                                     ← Query result shapes (no DB deps)
├── dto/                                             ← class-validator decorated DTOs
│   ├── create-<entity>.dto.ts
│   ├── find-all-<entity>.dto.ts
│   └── update-<entity>.dto.ts
├── enums/                                           ← TypeScript enums only
├── infrastructure/
│   └── persistence/
│       ├── <module>.abstract.repository.ts          ← PORT (abstract class, interface)
│       └── relational/
│           ├── entities/                            ← TypeORM entities, snake_case columns
│           ├── mappers/                             ← Static toDomain() / toPersistence()
│           ├── repositories/                        ← ADAPTER (implements abstract repo)
│           ├── queries/                             ← Raw SQL constants + query mappers
│           └── relational-persistence.module.ts
├── <module>.controller.ts                           ← HTTP layer only
├── <module>.service.ts                              ← Business logic, uses abstract repo
└── <module>.module.ts
```

---

## Dependency Rules (NEVER violate)

| Layer | Can import from | NEVER import from |
|---|---|---|
| `domain/` | `@src/utils/types/` | `infrastructure/`, `typeorm`, `@nestjs/typeorm`, other module's infra |
| `service.ts` | `domain/`, abstract repo, `@src/common/`, `@src/utils/` | TypeORM `Repository<>`, concrete repos, DB entities |
| Abstract repo | `domain/`, `@src/utils/types/` | TypeORM, DB entities, concrete repos |
| Concrete repo | DB entities, mappers, abstract repo, `@src/utils/` | Other modules' concrete repos |
| `mapper.ts` | domain entity, DB entity | services, controllers, other mappers |
| `controller.ts` | service, domain (for types), DTOs | repos, mappers, DB entities |

---

## Import Alias

All absolute imports use `@src/`:
```typescript
import { NOT_FOUND } from '@src/common/exceptions';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { pagination } from '@src/utils/pagination';
import { infinityPagination } from '@src/utils/infinity-pagination';
import { runRawQueryOnReadReplica } from '@src/database-helpers/run-raw-query-on-read-replica';
```

---

## Error Handling — ALWAYS use @src/common/exceptions

```typescript
// ✅ Correct
import { NOT_FOUND, UNPROCESSABLE_ENTITY, BAD_REQUEST, FORBIDDEN } from '@src/common/exceptions';
throw NOT_FOUND('Booking', { id });
throw UNPROCESSABLE_ENTITY('Method not found on repository.', 'field');
throw BAD_REQUEST('Invalid payload');

// ❌ Wrong — never throw raw NestJS exceptions in services
throw new NotFoundException({ ... });
throw new BadRequestException('...');
```

---

## Pagination — Two patterns

```typescript
// infinityPagination: for list endpoints returning InfinityPaginationResponseDto
import { infinityPagination } from '@src/utils/infinity-pagination';
return infinityPagination(await this.service.findAllWithPagination({ paginationOptions }), { page, limit });

// pagination: for raw-query endpoints returning PaginationResponseDto with total count
import { pagination } from '@src/utils/pagination';
const { data, count } = await this.repo.findWithPagination({ paginationOptions, filter });
return pagination(data, count, paginationOptions);
```

---

## Mapper Pattern — ALWAYS static, ALWAYS called on read

```typescript
// ✅ Correct: static methods, always map before returning
return entity ? BookingMapper.toDomain(entity) : null;
return entities.map((e) => BookingMapper.toDomain(e));

// ❌ Wrong: returning raw DB entity from repo, or instantiating mapper
return entity;          // never return un-mapped entity from a repo method
new BookingMapper();    // mappers are never instantiated
```

---

## Repository Pattern — Single-responsibility methods

```typescript
// ✅ Correct: specific methods per query
async findByEmail(email: string): Promise<NullableType<User>> {}
async findByIds(ids: string[]): Promise<User[]> {}

// ❌ Wrong: universal/generic find
async find(condition: UniversalConditionInterface): Promise<User> {}
```

---

## Raw Queries — Use runRawQueryOnReadReplica

```typescript
import { runRawQueryOnReadReplica } from '@src/database-helpers/run-raw-query-on-read-replica';
// Store SQL in src/<module>/infrastructure/persistence/relational/queries/<module>-queries.const.ts
const data = await runRawQueryOnReadReplica(this.someRepository, SOME_QUERY, [param1]);
```

---

## Code Generation — Use Hygen for new modules

```bash
npx hygen resource-entity new   # generates full hexagonal scaffold
```
See `docs/hygen/` for templates.

---

## NEVER List (hard violations)

- NEVER import TypeORM or DB entities into `domain/` files
- NEVER inject `@InjectRepository` or TypeORM `Repository<>` directly into a service
- NEVER return a raw DB entity from a repository method (always call Mapper.toDomain())
- NEVER use `console.log/warn/error` — use NestJS Logger (`new Logger('ClassName')`)
- NEVER use `export default` anywhere
- NEVER throw raw NestJS exceptions — use helpers from `@src/common/exceptions`
- NEVER create universal/generic repository methods — one method per query shape

---

## Routing Table (leaf docs for agents)

| Working on... | Read |
|---|---|
| Layer conventions, file placement | `docs/layers/index.md` |
| Domain entities (`domain/*.ts`) | `docs/layers/domain.md` |
| Services (`*.service.ts`) | `docs/layers/service.md` |
| Repositories (abstract or concrete) | `docs/layers/repository.md` |
| Mappers (`*.mapper.ts`) | `docs/layers/mapper.md` |
| Controllers (`*.controller.ts`) | `docs/layers/controller.md` |
| DTOs (`*.dto.ts`) | `docs/layers/dto.md` |
| File placement / new files | `docs/cross-cutting/file-placement.md` |
| Exception handling | `docs/cross-cutting/exceptions.md` |
| Hook enforcement system | `docs/agent-hooks-guide.md` |

---

## Enforcement Summary

PreToolUse (before every Edit/Write): injects matching leaf docs + blocks bad file placements.
PostToolUse (after every Edit/Write): grep-based convention checks, exit 2 blocks if violated.
Agents self-correct before proceeding — violations never survive a session.
