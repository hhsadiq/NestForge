# Project Scripts Index

## Overview

Central index of all `npm run` scripts with description, docs, prerequisites, command, and expected output. Use this to quickly run the right task.

Note: For all commands, follow the workspace rule to invoke npm via bash:

```bash
source ~/.bashrc && npm run <script>
```

### How this command should run

1. Always display all sections below (full index) to the user first.
2. Ask the user which script to run and any arguments.
3. Run the requested script using the bash invocation, then report concise results.

---

## Table of Contents <!-- omit in toc -->

- [Setup and Start](#setup-and-start)
- [Build and Lint](#build-and-lint)
- [Testing](#testing)
- [Database: TypeORM and Migrations](#database-typeorm-and-migrations)
- [Database: Seeding](#database-seeding)
- [Hygen Code Generators](#hygen-code-generators)
- [Project Utilities](#project-utilities)

---

## Setup and Start

### setup
- Description: Full project setup (env, deps, DB, generation), brings API up with Swagger.
- Docs: [docs/setup-script.md](../../docs/setup-script.md), [docs/installing-and-running.md](../../docs/installing-and-running.md)
- Prerequisites:
  - Docker, Node.js, PostgreSQL env vars configured in `env-example-relational`
  - For custom schema: provide SQL script at `.hygen/generate-migration/sql-script.sql`
  - For custom schema: provide JSON entities at `.hygen-entities-generator/entities-generator.json`
- Command:
  ```bash
  source ~/.bashrc && npm run setup
  ```
- Expected output: Installed deps, DB ready, generated entities (if configured), server reachable at http://localhost:3000/docs

### start | start:dev | start:debug | start:prod
- Description: Start application in various modes.
- Docs: [docs/installing-and-running.md](../../docs/installing-and-running.md)
- Prerequisites: Built code for `start:prod`; otherwise Node.js.
- Commands:
  ```bash
  source ~/.bashrc && npm run start
  source ~/.bashrc && npm run start:dev
  source ~/.bashrc && npm run start:debug
  source ~/.bashrc && npm run start:prod
  ```
- Expected output: Nest app running; dev/watch variants auto-reload.

---

## Build and Lint

### build
- Description: Compile the project to `dist/`.
- Docs: [docs/installing-and-running.md](../../docs/installing-and-running.md)
- Prerequisites: None
- Command:
  ```bash
  source ~/.bashrc && npm run build
  ```
- Expected output: `dist/` directory populated; no TypeScript errors.

### lint
- Description: Run ESLint with autofix.
- Docs: [docs/tests.md](../../docs/tests.md)
- Prerequisites: None
- Command:
  ```bash
  source ~/.bashrc && npm run lint
  ```
- Expected output: Lint issues fixed where possible; remaining issues listed.

---

## Testing

### test | test:watch | test:cov | test:debug
- Description: Run unit tests (Jest) in different modes.
- Docs: [docs/tests.md](../../docs/tests.md)
- Prerequisites: None
- Commands:
  ```bash
  source ~/.bashrc && npm run test
  source ~/.bashrc && npm run test:watch
  source ~/.bashrc && npm run test:cov
  source ~/.bashrc && npm run test:debug
  ```
- Expected output: Passing unit tests; coverage report for `test:cov`.

### test:e2e | test:e2e:watch
- Description: Run e2e tests with dedicated Jest config.
- Docs: [docs/tests.md](../../docs/tests.md)
- Prerequisites: App and DB reachable per e2e config.
- Commands:
  ```bash
  source ~/.bashrc && npm run test:e2e
  source ~/.bashrc && npm run test:e2e:watch
  ```
- Expected output: e2e test suite results.

### test:e2e:relational:docker
- Description: Run e2e tests inside Docker environment for relational DB.
- Docs: [docs/tests.md](../../docs/tests.md), [docs/docker.md](../../docs/docker.md)
- Prerequisites: Docker installed; `env-example-relational` configured.
- Command:
  ```bash
  source ~/.bashrc && npm run test:e2e:relational:docker
  ```
- Expected output: Containers spin up, e2e tests run, containers torn down.

---

## Database: Migrations

### migration:generate | migration:create | migration:run | migration:revert | schema:drop
- Description: Manage migrations using the configured data source.
- Docs: [docs/database.md](../../docs/database.md)
- Prerequisites: DB reachable; data source configured.
- Commands:
  ```bash
  source ~/.bashrc && npm run migration:generate -- <path/<filename>>
  source ~/.bashrc && npm run migration:create -- <path/<filename>>
  source ~/.bashrc && npm run migration:run
  source ~/.bashrc && npm run migration:revert
  source ~/.bashrc && npm run schema:drop
  ```
- Expected output: Migration files created/applied/reverted; schema dropped for `schema:drop`.

---

## Database: Seeding

### seed:create:relational | seed:run:relational
- Description: Create and run database seeds for relational DB.
- Docs: [docs/database.md](../../docs/database.md)
- Prerequisites: DB reachable; seed templates configured.
- Commands:
  ```bash
  source ~/.bashrc && npm run seed:create:relational
  source ~/.bashrc && npm run seed:run:relational
  ```
- Expected output: Seed file scaffolded; seed data inserted when running.

---

## Hygen Code Generators

### generate:entities
- Description: Batch entity/sub-entity/relationship/enum generation from JSON.
- Docs: [docs/hygen/entities.md](../../docs/hygen/entities.md), [docs/hygen/sql-to-json-entities-prompt.md](../../docs/hygen/sql-to-json-entities-prompt.md)
- Prerequisites: `.hygen-entities-generator/entities-generator.json` prepared.
- Command:
  ```bash
  source ~/.bashrc && npm run generate:entities
  ```
- Expected output: Resource files generated; project builds and lints afterwards.

### generate:resource | generate:sub-entity | generate:relationship | generate:enum
- Description: Generate individual resources, sub-entities, relationships, or enums.
- Docs: [docs/hygen/resource-entity.md](../../docs/hygen/resource-entity.md), [docs/hygen/sub-entity.md](../../docs/hygen/sub-entity.md), [docs/hygen/relationship.md](../../docs/hygen/relationship.md), [docs/hygen/enum.md](../../docs/hygen/enum.md)
- Prerequisites: For JSON-driven runs set `DATA_FILE` env var.
- Commands:
  ```bash
  source ~/.bashrc && npm run generate:resource
  source ~/.bashrc && npm run generate:sub-entity
  source ~/.bashrc && npm run generate:relationship
  source ~/.bashrc && npm run generate:enum
  ```
- Expected output: Generated module scaffolds per hexagonal architecture.

### generate:query (Raw Query)
- Description: Add a raw query to a relational resource.
- Docs: [docs/hygen/raw-query.md](../../docs/hygen/raw-query.md)
- Prerequisites: Target resource exists; JSON or interactive inputs prepared.
- Command:
  ```bash
  source ~/.bashrc && npm run generate:query
  ```
- Expected output: Query file added; linter runs post-hook.

### generate:version
- Description: Add version handling to a relational resource.
- Docs: [docs/hygen/version.md](../../docs/hygen/version.md)
- Prerequisites: Target resource exists.
- Command:
  ```bash
  source ~/.bashrc && npm run generate:version
  ```
- Expected output: Version artifacts added; linter runs post-hook.

### generate:migration | generate:migration-from-sql
- Description: Create migration via guided prompts or from SQL.
- Docs: [docs/hygen/migration-automation.md](../../docs/hygen/migration-automation.md)
- Prerequisites: DB schema or SQL ready.
- Commands:
  ```bash
  source ~/.bashrc && npm run generate:migration
  source ~/.bashrc && npm run generate:migration-from-sql
  ```
- Expected output: Migration file(s) created.

### add:property
- Description: Add a property to an existing relational resource.
- Docs: [docs/hygen/property.md](../../docs/hygen/property.md)
- Prerequisites: Target resource exists.
- Command:
  ```bash
  source ~/.bashrc && npm run add:property
  ```
- Expected output: Property added; linter runs post-hook.

---

## Project Utilities

### project:rename
- Description: Rename the project using a shell script.
- Docs: [docs/project-rename.md](../../docs/project-rename.md)
- Prerequisites: Bash available; ensure no uncommitted conflicting changes.
- Command:
  ```bash
  source ~/.bashrc && npm run project:rename -- <old-name> <new-name>
  ```
- Expected output: Project files updated with new names.

---

## How to Run

Tell me the exact script name (and any args). I will run it for you using the required bash invocation, e.g.:

```bash
source ~/.bashrc && npm run <script> -- <args>
```


