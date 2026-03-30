# Domain Layer

Last verified: 2026-03-30

## Inject

Domain entities are pure TypeScript classes. They have zero infrastructure dependencies.

**Naming**: `src/<module>/domain/<entity>.ts` — camelCase properties.
**Class name**: matches filename, e.g. `booking.ts` → `export class Booking {}`.
No `@Entity()`, no TypeORM decorators, no `@nestjs/typeorm`, no DB imports.

```typescript
// ✅ Correct domain entity
export class Booking {
  id: number;
  userId: number;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Query result shapes** live in `domain/queries/<name>-query.ts` — same rules: pure TS, no DB deps.

Never import from:
- `infrastructure/` (entities, mappers, repos)
- `typeorm` or `@nestjs/typeorm`
- Other modules' `infrastructure/` paths

Only allowed imports: `@src/utils/types/` for shared type primitives.

Canonical examples:
- `src/bookings/domain/booking.ts`
- `src/bookings/domain/queries/property-review-query.ts`

## Reference

Domain entities are the core of hexagonal architecture. The service layer works exclusively with
these. Repositories receive and return domain entities (the mapper bridges to/from DB entities).

The camelCase ↔ snake_case split is intentional:
- Domain (and service, controller, DTO) uses camelCase
- DB entities use snake_case
- Mappers translate between them

If a domain entity needs a computed field, derive it in the mapper's `toDomain()` method,
not by adding DB knowledge to the domain class.
