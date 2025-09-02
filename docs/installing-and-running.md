# Installation

This project is using [TypeORM](https://www.npmjs.com/package/typeorm) along with [PostgreSQL](https://www.postgresql.org/).

Interactions with the database are implemented based on [Hexagonal Architecture](architecture.md#hexagonal-architecture). Benefits of this architecture are described in detail in the [benefits](architecture.md#benefits) section.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development (PostgreSQL + TypeORM)](#comfortable-development-postgresql--typeorm)
- [Quick run (PostgreSQL + TypeORM)](#quick-run-postgresql--typeorm)
  - [Video guideline](#video-guideline)
- [Debugging](#debugging)
- [Links](#links)

---

## Comfortable development (PostgreSQL + TypeORM)

1. Clone repository

   ```bash
   git clone --depth 1 git@github.com:hhsadiq/nestforge.git my-app
   ```

1. Go to folder, and copy `env-example-relational` as `.env`.

   ```bash
   cd my-app/
   cp env-example-relational .env
   ```

1. Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

   Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

1. Run additional container:

   ```bash
   docker compose up -d postgres adminer maildev
   ```

1. Install dependency

   ```bash
   npm install
   ```

1. Run migrations

   ```bash
   npm run migration:run
   ```

1. Run seeds

   ```bash
   npm run seed:run:relational
   ```

1. Update the auth secret keys in the .env files as per the guidelines outlined in the [auth section](auth.md#configure-auth)

1. Run app in dev mode

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000>

---

## Quick run (PostgreSQL + TypeORM)

If you want quick run your app, you can use following commands:

1. Clone repository

   ```bash
   git clone --depth 1 git@github.com:hhsadiq/nestforge.git my-app
   ```

1. Go to folder, and copy `env-example-relational` as `.env`.

   ```bash
   cd my-app/
   cp env-example-relational .env
   ```

1. Run containers

   ```bash
   docker compose up -d
   ```

1. For check status run

   ```bash
   docker compose logs
   ```

1. Open <http://localhost:3000>

### Video guideline

<https://user-images.githubusercontent.com/6001723/235758846-d7d97de8-dea9-46d8-ae12-8cc6b76df03d.mp4>

---

## Debugging

After you app is up and running, [follow this video tutorial](https://www.youtube.com/watch?v=QL3KXE1hOgA) to configure the debugging in vs code.

---

## Links

- Swagger (API docs): <http://localhost:3000/docs>
- Adminer (client for DB): <http://localhost:8080>
- Maildev: <http://localhost:1080>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
