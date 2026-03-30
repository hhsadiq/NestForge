# Exception Handling

Last verified: 2026-03-30

## Inject

All exceptions in services must use helpers from `@src/common/exceptions`. Never throw raw
NestJS exceptions directly in service code.

```typescript
import {
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  BAD_REQUEST,
  FORBIDDEN,
  UNAUTHORIZED,
  CustomException,
} from '@src/common/exceptions';
```

**NOT_FOUND** — entity does not exist:
```typescript
throw NOT_FOUND('Booking', { id });
// → 404: "Booking not found for id: 42"

throw NOT_FOUND('User', { email });
// → 404: "User not found for email: foo@bar.com"
```

**UNPROCESSABLE_ENTITY** — logic/validation error with a named attribute:
```typescript
throw UNPROCESSABLE_ENTITY('Method findByEmail not found on user repository.', 'email');
// → 422: { errors: { email: 'Method...' } }
```

**BAD_REQUEST** — malformed input:
```typescript
throw BAD_REQUEST('Invalid date range: checkOut must be after checkIn');
// → 400
```

**FORBIDDEN** — authenticated but not authorized:
```typescript
throw FORBIDDEN('You do not own this booking.', 'bookingId');
// → 403
```

**UNAUTHORIZED** — not authenticated:
```typescript
throw UNAUTHORIZED('Token expired.', 'token');
// → 401
```

**CustomException** — conflict/business rule violation:
```typescript
throw CustomException('Booking already exists for this date range.', 'checkIn');
// → 409
```

Wrong pattern — do not throw raw NestJS exceptions in services:
```typescript
// ❌
throw new NotFoundException({ statusCode: 404, errors: { id: '...' } });
throw new BadRequestException('Invalid payload');
throw new UnprocessableEntityException({ ... });
```

The helpers produce consistent, structured error responses that the global exception filter
expects. Raw NestJS exceptions bypass this structure.

Canonical example: `src/bookings/bookings.service.ts` — uses NOT_FOUND and UNPROCESSABLE_ENTITY.

## Reference

`src/common/exceptions.ts` defines all helpers. They are thin wrappers around the corresponding
NestJS exception classes but produce a standardized `{ statusCode, errors, stack }` body that
the frontend and API consumers depend on.

Controllers do not throw exceptions directly — delegate to services which use these helpers.
