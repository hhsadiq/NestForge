# Architecture

---

## Table of Contents <!-- omit in toc -->

- [Hexagonal Architecture](#hexagonal-architecture)
- [Conceptual Benefits](#conceptual-benefits)
  - [Database Interactions](#database-interactions)
    - [Decoupling Services from Database Repositories \& Enhanced Testability](#decoupling-services-from-database-repositories--enhanced-testability)
  - [Third-Party Integrations](#third-party-integrations)
- [Practical Benefits of Hexagonal Architecture](#practical-benefits-of-hexagonal-architecture)
  - [1. Pre-defined Structure - No Architectural Decisions](#1-pre-defined-structure---no-architectural-decisions)
  - [2. Decoupled Business Logic Enables Query Optimization and Swappable ORMs](#2-decoupled-business-logic-enables-query-optimization-and-swappable-orms)
  - [3. Payment Module Example - Platform Abstraction](#3-payment-module-example---platform-abstraction)
  - [4. Development Time Efficiency](#4-development-time-efficiency)
- [Module Structures](#module-structures)
  - [Parent Module Structure](#parent-module-structure)
  - [Sub-entity or Sub-module Structure](#sub-entity-or-sub-module-structure)
- [Naming Conventions](#naming-conventions)
  - [1. Client-Facing and Business Logic (camelCase)](#1-client-facing-and-business-logic-camelcase)
  - [2. Database Layer (snake_case)](#2-database-layer-snake_case)
  - [3. Role of Mappers: Bridging the Gap](#3-role-of-mappers-bridging-the-gap)
- [Recommendations](#recommendations)
  - [Repository](#repository)
  - [Handling Modular Circular Dependencies](#handling-modular-circular-dependencies)
- [Pitfalls \& Drawbacks](#pitfalls--drawbacks)
- [FAQ](#faq)
  - [Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?](#is-there-a-way-to-generate-a-new-resource-controller-service-dtos-etc-with-hexagonal-architecture)
  - [I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs)
- [Links](#links)

---

## Hexagonal Architecture

This project is based on [Hexagonal Architecture](https://www.youtube.com/watch?v=bDWApqAUjEI). This architecture is also known as Ports and Adapters.

![Hexagonal Architecture Diagram](https://github.com/brocoders/nestjs-boilerplate/assets/6001723/6a6a763e-d1c9-43cc-910a-617cda3a71db)

## Conceptual Benefits

### Database Interactions

#### Decoupling Services from Database Repositories & Enhanced Testability

The project uses a structure where services operate independently of the inner workings of repositories. In this architecture, the service layer interacts exclusively with domain entities, remaining unaware of the underlying database entities. Conversely, repositories handle database entities without any knowledge of the domain entities. This clear separation is maintained through the use of mappers, which are responsible for converting data between domain models and persistence entities.

Mappers play a crucial role in breaking the coupling at the column level, ensuring that changes in the database schema do not directly affect the business logic, and vice versa. This decoupling is essential for several reasons:

1. **Modularity**: Services can be developed and maintained independently of the database schema, making the codebase more modular and easier to manage.
2. **Flexibility**: Changes to the database schema, like adding or modifying columns, do not affect the business logic. This reduces the risk of errors and simplifies maintenance. In large-scale projects, this flexibility ensures that evolving database schemas won't disrupt endpoint responses.
3. **Testability**: With database interactions abstracted behind interfaces, it's easier to mock the database during testing. This leads to more reliable and faster tests, as the business logic can be tested independently of the database.

4. **Adaptability**: The project can adapt to changes in third-party providers or database technologies with minimal impact on the core business logic, enhancing the project's longevity and resilience.

By enforcing these practices, the project ensures a clean separation of concerns, promotes maintainability, and supports robust testing strategies.

### Third-Party Integrations

Given this project will involve a lot of 3rd party integrations, so it can pay off there as well.

1. **Isolated and Replaceable Integrations**: Third-party integrations are modular and can be easily swapped out without affecting the core business logic. This is particularly advantageous for long-term projects, where you may need to replace one third-party provider with another offering similar services.
2. **Improved Testability and Reliability**: Abstracting third-party services makes it easier to create mock versions, leading to more reliable and faster testing.

## Practical Benefits of Hexagonal Architecture

Hexagonal Architecture is not just a theoretical pattern—it brings real, practical value to your day-to-day development work. Below are a few tangible benefits based on real-world scenarios:

### 1. Pre-defined Structure - No Architectural Decisions

In traditional three-tier designs, engineers often have to think through architecture decisions for every module—where to place files, how to structure services, what the naming conventions should be, and so on. This architecture enforces a predefined folder and file structure across modules: from DTOs to services, mappers, entities, and repositories.

This standardization saves cognitive effort and promotes developer productivity and consistency. Your team no longer has to debate “where things go”—they just follow the established pattern.

### 2. Decoupled Business Logic Enables Query Optimization and Swappable ORMs

Suppose you have written a TypeORM-based query in repository layer and built some business logic in the service layer on top of that. In the longer run, you decide to replace this complex TypeOrm query with a raw query for performance:

With hexagonal architecture:

- Your business logic remains intact
- You only need to update the repository implementation and the mappers
- No changes required in the service layer
- This change has zero impact on your business logic

This is a classic example of continuous improvement. Without this architecture, you would have to update both the repository layer implementation and then modify the business logic to accommodate the new response structure.

### 3. Payment Module Example - Platform Abstraction

Use Case: You're building an in-app purchase module. You can organize it like this:

```
payment/
├── domain/
│   └── payment.ts
├── service/
│   └── payment.service.ts
├── infrastructure/
│   └── third-party/
│       ├── google/
│       │   └── google-payment.adapter.ts
│       ├── apple/
│       │   └── apple-payment.adapter.ts
│       └── huawei/
│           └── huawei-payment.adapter.ts
│       └── mappers/
│           └── platform.mapper.ts
│       └── ports/
│           └── payment.port.ts
└── module.ts
```

In this setup:

- Your business logic in `payment.service.ts` interacts only with the payment port interface. It has no concern about any specific payment platform
- Platform-specific details (Google, Apple, Huawei) are encapsulated in their own adapters.
- If you need to replace a payment platform or its API changes, in the future, you just update that specific adapter and mapper
- The core business logic remains completely intact
- Perfect separation of concerns which enables scalability, testability, and platform independence.

### 4. Development Time Efficiency

For modules with simple CRUD operations (where you could traditionally work with 3-tier architecture), the expected additional development time is actually saved due to the integrated code generation tool Hygen. The pre-defined structure and generators make development faster, not slower.

## Module Structures

### Parent Module Structure

```txt
.
├── domain
│   └── [DOMAIN].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── document  (for NoSQL DB; present only if NoSQL is used)
│       │   ├── document-persistence.module.ts
│       │   ├── entities
│       │   │   └── [SCHEMA].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       ├── relational (for SQL DB; present only if SQL is used)
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

[DOMAIN].ts represents an entity used in the business logic. Domain entity has no dependencies on the database or any other infrastructure.

[SCHEMA].ts represents the database structure used in document-oriented databases (e.g., MongoDB).

[ENTITY].ts represents the database structure used in relational databases (e.g., PostgreSQL).

[MAPPER].ts converts database entities to domain entities and vice versa.

[PORT].repository.ts defines the repository port (interface) for interacting with the database.

[ADAPTER].repository.ts implements the repository port and interacts with the database.

### Sub-entity or Sub-module Structure

Sometimes a module has additional entities that are children of the module’s main domain entity. We call these sub-entities or sub-modules. The parent module exists at `src/[module]`, and the child lives within the same module, sharing the same controller/service/module and repository port/adapter while adding child-specific domain, entities, and mappers.

Structure:

```txt
.
├── controller.ts           (same file for parent and child)
├── module.ts               (same file for parent and child)
├── service.ts              (same file for parent and child)
├── domain
│   ├── [DOMAIN].ts
│   └── [CHILD_DOMAIN].ts
├── dto                     (at the same level as parent)
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
└── infrastructure
    └── persistence
        ├── [PORT].repository.ts         (same file for parent and child)
        ├── relational/                  (for SQL DB; present only if SQL is used)
        │   ├── entities
        │   │   ├── [ENTITY].ts
        │   │   └── [CHILD_ENTITY].ts
        │   ├── mappers
        │   │   ├── [MAPPER].ts
        │   │   └── [CHILD_MAPPER].ts
        │   └── repositories
        │       └── [ADAPTER].repository.ts   (same file for parent and child)
        └── document/                  (present only if NoSQL is used, follow the same structure as relational folder)
            └── ...
```

`[CHILD_DOMAIN].ts` is an additional domain entity conceptually subordinate to the parent’s domain entity.

`[CHILD_ENTITY].ts` and `[CHILD_MAPPER].ts` mirror the parent’s persistence and mapping layers for the child entity.

Key points:

- **Shared files**: `controller.ts`, `service.ts`, `module.ts`, and repository port/adapter files are the same for parent and child.
- **Domain**: both parent and child domain entities live side-by-side.
- **DTOs**: remain at the same level as the parent’s DTOs.
- **Persistence**: parent and child database entities and mappers co-exist; the repository adapter remains the same.

This layout keeps business logic centralized while allowing the module to grow with related sub-entities without duplicating controllers, services, modules, or repository interfaces/adapters.

**Relational vs Document**: The `relational` folder exists only when using a relational SQL database. The `document` folder exists
only when using a NoSQL database (e.g., MongoDB) and follows the same structure as the `relational` folder.

## Naming Conventions

This project enforces a clear separation of naming conventions to ensure consistency and maintainability across different layers:

### 1. Client-Facing and Business Logic (camelCase)

All data exchanged with the client, as well as the internal business logic within the application, follows the **camelCase** naming convention. This applies to:

- **Domain files**: (`[DOMAIN].ts`, `[CHILD_DOMAIN].ts`)
- **Controllers**: (`controller.ts`)
- **Services**: (`service.ts`)
- **DTOs (Data Transfer Objects)**: (`create.dto.ts`, `find-all.dto.ts`, `update.dto.ts`, etc.)

This ensures that the service layer and all interactions with external clients consistently use a readable and common standard.

### 2. Database Layer (snake_case)

Conversely, files directly related to the database structure and interactions adhere to the **snake_case** naming convention. This primarily includes:

- **Entity files**: (`[ENTITY].ts`, `[SCHEMA].ts`, `[CHILD_ENTITY].ts`, `[CHILD_SCHEMA].ts`)

### 3. Role of Mappers: Bridging the Gap

The `[MAPPER].ts` files play a crucial role in translating between these two naming conventions, ensuring a clean separation of concerns. Mappers contain functions such as `toDomain()` and `toPersistence()`:

- **`toPersistence()`**: When data is being written to or updated in the database, it first passes through the relevant `toPersistence()` function. This function is responsible for converting attributes from **camelCase** (from the service layer) to **snake_case** (for the database layer).

- **`toDomain()`**: When data is retrieved from the database, it is always in **snake_case**. This data is then passed to the `toDomain()` function of the relevant mapper, which translates the attributes back into **camelCase** format before returning them to the service layer.

This strict separation ensures that the service layer remains entirely free of snake_case attributes, receiving all data in a consistent camelCase format, regardless of its origin.

## Recommendations

### Repository

Don't try to create universal methods in the repository because they are difficult to extend during the project's life. Instead of this create methods with a single responsibility.

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }

  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }

  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

### Handling Modular Circular Dependencies

In NestJS, circular dependencies between modules (e.g., when `User` and `File` modules depend on each other) can lead to application startup issues. To resolve this, a common module can be introduced to encapsulate shared logic or interactions between the interdependent modules.

**Approach:**

1. **Create a Common Module**: Design a new module (e.g., `user-and-file/`) that acts as an intermediary.
2. **Shared Service and Repository Layer**: This common module will primarily contain:
   - A service file to house business logic that involves both entities.
   - A dedicated repository layer where both `User` and `File` entities are imported.
3. **Centralized Database Operations**: The common module's repository will perform database calls that involve interactions between the `User` and `File` entities. This centralizes the data access logic, effectively breaking the circular dependency by abstracting the direct interaction between the original `User` and `File` modules.

This approach ensures a clear separation of concerns while effectively managing complex inter-module relationships, enhancing modularity and maintainability.

## Pitfalls & Drawbacks

While hexagonal architecture provides significant benefits, there are some considerations to keep in mind:

**Initial Complexity**: Hexagonal Architecture can take more effort to implement initially, but it provides more flexibility and scalability in the long run. [You still can use Three-tier architecture](#i-dont-want-to-use-hexagonal-architecture-how-can-i-use-a-traditional-three-tier-architecture-for-nestjs), but we recommend using Hexagonal Architecture. Try to create resources via our [Resource-Entity](hygen/resource-entity.md) - you'll find it takes the same time (maybe even less 🤔) as Three-tier architecture.

**Code Generation Limitations**: While we have integrated Hygen for code generation, it has its own limitations. For example:

- Complex customizations may require manual intervention

**AI Tool Integration**: AI tools cannot fully understand the hexagonal structure, making it somewhat difficult to get things done with AI agents like Cursor AI or GitHub Copilot. The tools may not suggest the most appropriate file locations or understand the separation of concerns.

📘 For improving AI effectiveness in large codebases, refer to the official Cursor documentation: [https://docs.cursor.com/guides/advanced/large-codebases](https://docs.cursor.com/guides/advanced/large-codebases)

**Minor Edit Overhead**: Sometimes minor edits in modules can take longer due to the need to update multiple layers (domain, mappers, adapters), though this is offset by the long-term maintainability benefits.

---

## FAQ

### Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?

Yes, you can use the [Resource-Entity](hygen/resource-entity.md) to generate a new resource with Hexagonal Architecture.

### I don't want to use Hexagonal Architecture. How can I use a traditional (three-tier) architecture for NestJS?

You still can use [Three-tier Architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture) `[controllers] -> [services] -> [data access]` near [Hexagonal Architecture](#hexagonal-architecture).

Database example: Just keep the existing approach of getting data from the database for auth, files, etc, as is (with Hexagonal Architecture), but for new modules use repositories from TypeORM directly in [services](https://docs.nestjs.com/providers#services). Entities and Schemas are ready for this.

---

## Links

- [Dependency Inversion Principle](https://trilon.io/blog/dependency-inversion-principle) with NestJS.

---

Previous: [Setup Script](setup-script.md)

Next: [Documentation Standards](documentation-standards.md)
