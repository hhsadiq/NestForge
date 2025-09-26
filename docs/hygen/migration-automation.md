# Migration Automation

This document explains the migration automation system that allows you to generate TypeORM migrations from SQL scripts with automatic rollback generation.

## Overview

The migration automation system provides two approaches for creating database migrations:

1. **Interactive Migration Generator** - Creates migrations through interactive SQL input
2. **File-based Migration Generator** - Converts existing SQL scripts into TypeORM migrations

## Interactive Migration Generator

### What this does

- **Interactive SQL input** - Enter SQL directly in the terminal
- **Generates TypeORM migration files** with proper up/down methods

### Key Features

- ✅ **Direct terminal input** - No file preparation required
- ✅ **Smart rollback generation** - Creates DROP TABLE statements with CASCADE

### How to use

1. **Run the interactive generator**:
   ```bash
   npm run generate:migration
   ```

2. **Enter your SQL script**:
   - The generator will prompt: "Enter your SQL script (press Ctrl+D when done)"
   - Type or paste your SQL directly in the terminal
   - Press Ctrl+D (or Ctrl+Z on Windows) when finished

3. **Enter migration name**:
   - Provide a descriptive name (e.g., `project-schema`, `user-authentication`)

4. **Migration created**:
   - SQL content will be injected into the `up()` method
   - DROP TABLE statements will be generated for the `down()` method

### Example Interactive Session

```bash
$ npm run generate:migration

📝 Enter your SQL script (press Ctrl+D when done):
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);
^D

Enter migration name (e.g., project-schema): blog-schema

🚀 Creating migration: blog-schema
📝 Running: npm run migration:create src/database/migrations/blog-schema
✅ Migration file created successfully
📝 Found migration file: 1758911080107-blog-schema.ts
📋 Found tables to drop: ['posts', 'users']
✅ Migration file updated with your SQL script
📁 Migration file: src/database/migrations/1758911080107-blog-schema.ts

🎉 Migration generation completed!

📋 Next steps:
   1. Review the generated migration file
   2. Run: npm run migration:run
```

## File-based Migration Generator

### What this does

- **Reads SQL scripts** from `.hygen/generate-migration/sql-script.sql`
- **Parses CREATE TABLE statements** to extract table names
- **Generates TypeORM migration files** with proper up/down methods

### Key Features

- ✅ **Automatic table detection** - Parses SQL to find all CREATE TABLE statements
- ✅ **Smart rollback generation** - Creates DROP TABLE statements with CASCADE
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
│   ├── migration-generator.js        # File-based migration generator
│   └── interactive-migration.js      # Interactive migration generator
└── sql-script.sql                   # SQL file for file-based mode
```

## Commands Reference

| Command | Purpose | Input Method |
|---------|---------|--------------|
| `npm run generate:migration` | Interactive migration creation | Terminal input |
| `npm run generate:migration-from-sql` | Generate migration from SQL file | File-based |

---

Previous: [Raw Query Generator](raw-query.md)

Next: [Property Generator](property.md)
