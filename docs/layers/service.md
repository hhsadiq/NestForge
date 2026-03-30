# Service Layer

Last verified: 2026-03-30

## Inject

Services contain business logic. They talk only to the abstract repository, never to concrete repos
or TypeORM directly.

**Constructor injection**: always inject the abstract repository class.
```typescript
// ✅ Correct
constructor(private readonly bookingRepository: BookingAbstractRepository) {}

// ❌ Wrong — injecting concrete repo or TypeORM repo
constructor(@InjectRepository(BookingEntity) private repo: Repository<BookingEntity>) {}
```

**Error handling**: always use helpers from `@src/common/exceptions`, never raw NestJS exceptions.
```typescript
// ✅
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
throw NOT_FOUND('Booking', { id });

// ❌
throw new NotFoundException({ statusCode: 404, ... });
```

**Pagination**: two helpers for two response shapes:
```typescript
// infinityPagination — for standard list endpoints (no total count)
return infinityPagination(await this.repo.findAllWithPagination({ paginationOptions }), { page, limit });

// pagination — for raw-query results that return { data, count }
const { data, count } = await this.repo.findPropertyReviewsWithPagination({ paginationOptions, filter });
return pagination(data, count, paginationOptions);
```

**findAndValidate pattern**: dynamic repo method dispatch, used when the same "find or throw"
logic is reused across multiple fields:
```typescript
async findAndValidate(field, value, fetchRelations = false) {
  const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`;
  if (typeof this.bookingRepository[repoFunction] !== 'function') {
    throw UNPROCESSABLE_ENTITY(`Method ${repoFunction} not found on booking repository.`, field);
  }
  const entity = await this.bookingRepository[repoFunction](value);
  if (!entity) throw NOT_FOUND('Booking', { [field]: value });
  return entity;
}
```

Never import from:
- `infrastructure/` paths
- TypeORM entities or repositories
- Other modules' services (use NestJS module imports to inject shared abstract repos instead)

Canonical examples:
- `src/bookings/bookings.service.ts`
- `src/properties/properties.service.ts`

## Reference

Services receive domain entities from the repo and return domain entities to controllers.
They never touch snake_case data. All DB layer concerns are behind the abstract repository port.

For cross-module logic, prefer injecting another module's abstract repository (register it in the
module's `providers` + `imports`) over calling another service. This prevents circular module
dependencies and keeps the service layer thin.
