# Migration Automation

This document explains the migration automation system that allows you to generate TypeORM migrations from SQL scripts with automatic rollback generation.

## Overview

The migration automation system provides a single approach for creating database migrations:

1. **SQL-to-Migration Generator** - Converts existing SQL scripts into TypeORM migrations

## SQL-to-Migration Generator

### What this does

- **Reads SQL scripts** from `.hygen/generate-migration/sql-script.sql`
- **Parses CREATE TABLE statements** to extract table names
- **Generates TypeORM migration files** with proper up/down methods
- **Creates intelligent rollback statements** by parsing table dependencies
- **Handles foreign key constraints** with CASCADE operations

### Key Features

- ✅ **Automatic table detection** - Parses SQL to find all CREATE TABLE statements
- ✅ **Smart rollback generation** - Creates DROP TABLE statements with CASCADE
- ✅ **Dependency-aware ordering** - Tables are dropped in reverse dependency order
- ✅ **TypeORM integration** - Generates proper TypeORM migration structure
- ✅ **Error handling** - Validates SQL content and provides helpful error messages

### How to use

1. **Prepare your SQL script**:
   ```sql
   -- Add your CREATE TABLE statements to:
   .hygen/generate-migration/sql-script.sql
   ```

2. **Run the generator**:
   ```bash
   npm run generate:migration-from-sql
   ```

3. **Follow the prompts**:
   - Enter a migration name (e.g., `project-schema`)
   - The generator will create the migration file
   - SQL content will be injected into the `up()` method
   - DROP TABLE statements will be generated for the `down()` method

### Example SQL Input

```sql
CREATE TABLE department (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faculty (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    employee_id TEXT NOT NULL UNIQUE,
    designation TEXT,
    department_id BIGINT NOT NULL REFERENCES department(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Generated Migration Output

The generator creates a TypeORM migration file with:

**Up Migration** (your SQL script):
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
CREATE TABLE department (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faculty (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    employee_id TEXT NOT NULL UNIQUE,
    designation TEXT,
    department_id BIGINT NOT NULL REFERENCES department(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
  `);
}
```

**Down Migration** (automatic rollback):
```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS department CASCADE;
  `);
}
```


## File Structure

```
.hygen/generate-migration/
├── relational-resource/
│   └── migration-generator.js    # SQL-to-migration generator
└── sql-script.sql               # Your SQL script input
```

## Commands Reference

| Command | Purpose | Input Method |
|---------|---------|--------------|
| `npm run generate:migration-from-sql` | Generate migration from SQL file | File-based |

---

Previous: [Raw Query Generator](raw-query.md)

Next: [Property Generator](property.md)
