# Repository Layer

Last verified: 2026-03-30

## Inject

Two files per module:

1. **Abstract repository** (`infrastructure/persistence/<module>.abstract.repository.ts`)
   — defines the port (interface as abstract class). Only imports domain entities and `@src/utils/types/`.

2. **Concrete repository** (`infrastructure/persistence/relational/repositories/<module>.repository.ts`)
   — implements the abstract repo. Uses TypeORM, DB entities, and mappers.

**Always call Mapper.toDomain() before returning** — never return a raw DB entity.
```typescript
// ✅
return entity ? BookingMapper.toDomain(entity) : null;
return entities.map((e) => BookingMapper.toDomain(e));

// ❌ Returning un-mapped entity
return entity;
```

**Single-responsibility methods** — one method per query shape, never universal `find(condition)`.
```typescript
// ✅
async findByEmail(email: string): Promise<NullableType<User>> {}
async findByIds(ids: string[]): Promise<User[]> {}
async findAllWithPagination({ paginationOptions }): Promise<Booking[]> {}

// ❌
async find(condition: UniversalConditionInterface): Promise<User> {}
```

**Raw queries** live in `relational/queries/<module>-queries.const.ts` as exported SQL string constants.
Run via `runRawQueryOnReadReplica` from `@src/database-helpers/run-raw-query-on-read-replica`.
```typescript
import { runRawQueryOnReadReplica } from '@src/database-helpers/run-raw-query-on-read-replica';
const data = await runRawQueryOnReadReplica(this.bookingRepository, PROPERTY_REVIEW_QUERY, [param]);
```

**Repo-to-repo imports are FORBIDDEN** — cross-table joins belong in services or a shared common module.
If two modules need each other, create a `src/<a>-and-<b>/` module (see architecture.md § Circular Deps).

Canonical examples:
- `src/bookings/infrastructure/persistence/booking.abstract.repository.ts`
- `src/bookings/infrastructure/persistence/relational/repositories/booking.repository.ts`

## Reference

The abstract repository is the "port". The concrete repository is the "adapter".
NestJS DI wires them: the persistence module registers the concrete class as a provider for the
abstract class token. Services never know which concrete implementation is running.

Pagination in concrete repos:
```typescript
const entities = await this.repo.find({
  skip: (paginationOptions.page - 1) * paginationOptions.limit,
  take: paginationOptions.limit,
});
```

`NullableType<T>` (from `@src/utils/types/nullable.type`) is `T | null` — use it as the return
type whenever the entity may not exist.
