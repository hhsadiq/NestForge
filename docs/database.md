# Work with database

---

## Table of Contents <!-- omit in toc -->

- [About databases](#about-databases)
- [Database Creation](#database-creation)
  - [Option A - Using Docker exec](#option-a---using-docker-exec)
  - [Option B - Using Database Tools](#option-b---using-database-tools)
  - [Environment Configuration](#environment-configuration)
- [DB tables naming conventions](#db-tables-naming-conventions)
  - [Reason 1: Convenience](#reason-1-convenience)
  - [Reason 2: Aesthetic and Order](#reason-2-aesthetic-and-order)
    - [Reason 3: Simplicity](#reason-3-simplicity)
  - [Reason 4: Globalization](#reason-4-globalization)
- [DB columns naming convention](#db-columns-naming-convention)
- [Working with database schema (TypeORM)](#working-with-database-schema-typeorm)
  - [Create a new migration without existing entities](#create-a-new-migration-without-existing-entities)
  - [Generate migration from existing entities](#generate-migration-from-existing-entities)
  - [Run migration](#run-migration)
  - [Revert migration](#revert-migration)
  - [Drop all tables in database](#drop-all-tables-in-database)
- [Seeding (TypeORM)](#seeding-typeorm)
  - [Creating seeds (TypeORM)](#creating-seeds-typeorm)
  - [Run seed (TypeORM)](#run-seed-typeorm)
  - [Factory and Faker (TypeORM)](#factory-and-faker-typeorm)
- [1. Define the SQL Query for the View](#1-define-the-sql-query-for-the-view)
- [2. Create the View Migration](#2-create-the-view-migration)
- [3. Add a View Entity](#3-add-a-view-entity)
- [4. Add a Domain Class](#4-add-a-domain-class)
- [5. Add a Mapper](#5-add-a-mapper)
- [6. Inject the View Repository](#6-inject-the-view-repository)
- [7. Implement View-Specific Methods](#7-implement-view-specific-methods)
- [Performance optimization (PostgreSQL + TypeORM)](#performance-optimization-postgresql--typeorm)
  - [Indexes and Foreign Keys](#indexes-and-foreign-keys)
  - [Max connections](#max-connections)
  - [Read Replica Support](#read-replica-support)
    - [Configuration](#configuration)
    - [Usage](#usage)
    - [Benefits](#benefits)

---

## About databases

This project supports PostgreSQL and uses the [Hexagonal Architecture](architecture.md#hexagonal-architecture) to work with it.

## Database Creation

Create a PostgreSQL database.

### Option A - Using Docker exec

```bash
# Create database directly
docker exec -it postgres createdb -U postgres your_database_name
```

### Option B - Using Database Tools

**Using Adminer (Web-based):**

- Open <http://localhost:8080>
- Credentials:
  - **System**: PostgreSQL
  - **Server**: postgres
  - **Username**: root
  - **Password**: secret
- Hit `login` button.

**Using DBeaver/PGAdmin (Desktop Tools):**

- Connect to `localhost:5432`
- **Username**: root
- **Password**: secret

### Environment Configuration

After creating the database, update your environment file:

```env
DATABASE_NAME=your_database_name
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

---

## DB tables naming conventions

We will use singular names for all database tables due to the following reasons:

### Reason 1: Convenience

It is easier to come up with singular names than with plural ones. Objects can have irregular plurals or no plural at all, but will always have a singular form (with few exceptions like News).

Examples:

- Customer
- Order
- User
- Status
- News

### Reason 2: Aesthetic and Order

Especially in master-detail scenarios, singular names read better, align better by name, and have a more logical order (Master first, Detail second):

1. Order
2. OrderDetail

Compared to:

1. OrderDetails
2. Orders

#### Reason 3: Simplicity

Put all together, Table Names, Primary Keys, Relationships, Entity Classes... it is better to be aware of only one name (singular) instead of two (singular class, plural table, singular field, singular-plural master-detail...):

Examples:

- Customer
- Customer.CustomerID
- CustomerAddress
- public class Customer { ... }
- `SELECT * FROM Customer WHERE CustomerID = 100`

Once you know you are dealing with "Customer", you can be sure you will use the same word for all of your database interaction needs.

### Reason 4: Globalization

The world is getting smaller, and you may have a team of different nationalities. Not everybody has English as a native language. It would be easier for a non-native English language programmer to think of "Repository" than of "Repositories", or "Status" instead of "Statuses". Having singular names can lead to fewer errors caused by typos, save time by not having to think "is it Child or Children?", hence improving productivity.

## DB columns naming convention

[Don't use upper case](https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_upper_case_table_or_column_names) letters in the column or table names.

## Working with database schema (TypeORM)

### Create a new migration without existing entities

E.g.

`npm run migration:create -- ./src/database/migrations/MakeTagNameUnique`

### Generate migration from existing entities

1. Create entity file with extension `.entity.ts`. For example `post.entity.ts`:

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     body: string;

     // Here any fields that you need
   }
   ```

1. Next, generate migration file:

   ```bash
   npm run migration:generate -- src/database/migrations/CreatePostTable
   ```

1. Apply this migration to database via [npm run migration:run](#run-migration).

### Run migration

```bash
npm run migration:run
```

### Revert migration

```bash
npm run migration:revert
```

### Drop all tables in database

```bash
npm run schema:drop
```

---

## Seeding (TypeORM)

### Creating seeds (TypeORM)

1. Create seed file with `npm run seed:create:relational -- --name=Post`. Where `Post` is name of entity.
1. Go to `src/database/seeds/relational/post/post-seed.service.ts`.
1. In `run` method extend your logic.
1. Run [npm run seed:run:relational](#run-seed-typeorm)

### Run seed (TypeORM)

```bash
npm run seed:run:relational
```

### Factory and Faker (TypeORM)

1. Install faker:

   ```bash
   npm i --save-dev @faker-js/faker
   ```

1. Create `src/database/seeds/relational/user/user.factory.ts`:

   ```ts
   import { faker } from '@faker-js/faker';
   import { RoleEnum } from '../../../../roles/roles.enum';
   import { StatusEnum } from '../../../../statuses/statuses.enum';
   import { Injectable } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
   import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
   import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

   @Injectable()
   export class UserFactory {
     constructor(
       @InjectRepository(UserEntity)
       private repositoryUser: Repository<UserEntity>,
       @InjectRepository(RoleEntity)
       private repositoryRole: Repository<RoleEntity>,
       @InjectRepository(StatusEntity)
       private repositoryStatus: Repository<StatusEntity>,
     ) {}

     createRandomUser() {
       // Need for saving "this" context
       return () => {
         return this.repositoryUser.create({
           firstName: faker.person.firstName(),
           lastName: faker.person.lastName(),
           email: faker.internet.email(),
           password: faker.internet.password(),
           role: this.repositoryRole.create({
             id: RoleEnum.user,
             name: 'User',
           }),
           status: this.repositoryStatus.create({
             id: StatusEnum.active,
             name: 'Active',
           }),
         });
       };
     }
   }
   ```

1. Make changes in `src/database/seeds/relational/user/user-seed.service.ts`:

   ```ts
   // Some code here...
   import { UserFactory } from './user.factory';
   import { faker } from '@faker-js/faker';

   @Injectable()
   export class UserSeedService {
     constructor(
       // Some code here...
       private userFactory: UserFactory,
     ) {}

     async run() {
       // Some code here...

       await this.repository.save(
         faker.helpers.multiple(this.userFactory.createRandomUser(), {
           count: 5,
         }),
       );
     }
   }
   ```

1. Make changes in `src/database/seeds/relational/user/user-seed.module.ts`:

   ```ts
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';

   import { UserSeedService } from './user-seed.service';
   import { UserFactory } from './user.factory';

   import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
   import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
   import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

   @Module({
     imports: [TypeOrmModule.forFeature([UserEntity, Role, Status])],
     providers: [UserSeedService, UserFactory],
     exports: [UserSeedService, UserFactory],
   })
   export class UserSeedModule {}
   ```

1. Run seed:

   ```bash
   npm run seed:run
   ```

---

# Adding Views

To create a new view in the application, follow these steps:

## 1. Define the SQL Query for the View

Add the SQL query for your new view in `src/modules/views/infrastructure/persistence/view.const.ts`. The query defines the structure of the view.

For example:

```ts
export const USER_SUMMARY_VIEW: ViewConst = {
  name: 'user_summary_view',
  expression: `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      r.name AS role_name,
      s.name AS status_name,
      f.path AS photo_url
    FROM "user" u
    LEFT JOIN role r ON u.role_id = r.id
    LEFT JOIN status s ON u.status_id = s.id
    LEFT JOIN file f ON u.photo_id = f.id
    WHERE s.name = 'Active'
  `,
};
```

## 2. Create the View Migration

Use the view query in a new migration to ensure it is properly created in the database. You can create the migration like this:

```ts
export class CreateUserSummaryView1725255027168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { name, expression } = USER_SUMMARY_VIEW;

    await queryRunner.query(`
        CREATE VIEW ${name} AS
        ${expression}
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW ${USER_SUMMARY_VIEW.name}`);
  }
}
```

## 3. Add a View Entity

Create an entity that maps the view in the src/modules/views/infrastructure/persistence/entities folder. This allows TypeORM to interact with the view.

```ts
import { ViewEntity, ViewColumn } from 'typeorm';

import { USER_SUMMARY_VIEW } from '@src/views/infrastructure/persistence/view.consts';

@ViewEntity(USER_SUMMARY_VIEW)
export class UserSummaryViewEntity {
  @ViewColumn()
  id: number;

  @ViewColumn()
  first_name: string;

  @ViewColumn()
  last_name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  role_name: string;

  @ViewColumn()
  status_name: string;

  @ViewColumn()
  photo_url: string;
}
```

## 4. Add a Domain Class

Create a corresponding domain class for this view. This class represents the data structure in the domain layer.

```ts
export class UserSummary {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty({
    type: String,
    example: 'John',
  })
  firstName: string | null;

  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  lastName: string | null;

  @ApiProperty({
    type: String,
    example: 'john.doe@example.com',
  })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @ApiProperty({
    type: String,
    example: 'User',
  })
  roleName: string | null;

  @ApiProperty({
    type: String,
    example: 'Active',
  })
  statusName: string | null;

  @ApiProperty({
    type: String,
    example: 'www.s3.com/image-path',
  })
  photoUrl: string | null;
}
```

## 5. Add a Mapper

Add a mapper to convert the data from the view entity into the domain class.

```ts
export class UserSummaryMapper {
  static toDomain(raw: UserSummaryViewEntity): UserSummary {
    const domainEntity = new UserSummary();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.firstName = raw.first_name;
    domainEntity.lastName = raw.last_name;
    domainEntity.roleName = raw.role_name;
    domainEntity.statusName = raw.status_name;
    domainEntity.photoUrl = raw.photo_url;
    return domainEntity;
  }
}
```

## 6. Inject the View Repository

Inject the repository for the view entity in the repository layer to interact with the view.
For example, in view.repository.ts:

```ts
constructor(
  @InjectRepository(UserSummaryViewEntity)
  private readonly userSummaryRepository: Repository<UserSummaryViewEntity>,
) {}
```

## 7. Implement View-Specific Methods

Finally, add the necessary methods to the abstract repository and implement them in the corresponding relational repository class.

For example, add specific methods to the abstract class:

```ts
export abstract class AbstractViewRepository {
  abstract findActiveUsers(): Promise<UserSummaryViewEntity[]>;
}
```

Then implement them in your concrete repository:

```ts
export class ViewRelationalRepository implements AbstractViewRepository {
  constructor(
    @InjectRepository(UserSummaryViewEntity)
    private readonly userSummaryRepository: Repository<UserSummaryViewEntity>,
  ) {}

  async findActiveUsers(): Promise<UserSummaryViewEntity[]> {
    return this.userSummaryRepository.find({
      where: { status_name: 'Active' },
    });
  }
}
```

## Performance optimization (PostgreSQL + TypeORM)

### Indexes and Foreign Keys

Don't forget to create `indexes` on the Foreign Keys (FK) columns (if needed), because by default PostgreSQL [does not automatically add indexes to FK](https://stackoverflow.com/a/970605/18140714).

### Max connections

Set the optimal number of [max connections](https://node-postgres.com/apis/pool) to database for your application in `/.env`:

```txt
DATABASE_MAX_CONNECTIONS=100
```

You can think of this parameter as how many concurrent database connections your application can handle.

### Read Replica Support

The application supports PostgreSQL read replicas for improved read performance and load distribution. This feature allows you to configure a separate read-only database instance that replicates data from the master database.

#### Configuration

To enable read replica support, add the following environment variable to your `.env` file:

```txt
DATABASE_READ_REPLICA=your-read-replica-host
```

When this environment variable is set, TypeORM will automatically configure replication with:

- **Master**: Your primary database (for write operations)
- **Slave**: Your read replica (for read operations)

#### Usage

The application provides a helper function to execute raw queries specifically on the read replica:

```ts
import { runRawQueryOnReadReplica } from '@src/database-helpers/run-raw-query-on-read-replica';

// Execute a raw query on the read replica
const result = await runRawQueryOnReadReplica(
  repository,
  'SELECT * FROM users WHERE status = $1',
  ['active'],
);
```

#### Benefits

- **Improved Read Performance**: Distribute read queries across multiple database instances
- **Reduced Master Load**: Keep write operations on the master while offloading reads
- **Better Scalability**: Handle more concurrent read operations
- **Automatic Failover**: TypeORM handles connection management automatically

---

Previous: [Hygen](hygen/index.md)

Next: [Cache](cache.md)
