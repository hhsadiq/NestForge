# Installation & Setup

This project is using [TypeORM](https://www.npmjs.com/package/typeorm) along with [PostgreSQL](https://www.postgresql.org/).

Interactions with the database are implemented based on [Hexagonal Architecture](architecture.md#hexagonal-architecture). Benefits of this architecture are described in detail in the [benefits](architecture.md#benefits) section.

---

## Table of Contents <!-- omit in toc -->

- [📋 Setup Prerequisites](#-setup-prerequisites)
  - [Prerequisites Documentation](#prerequisites-documentation)
- [🚀 Using Setup Script](#-using-setup-script)
- [🔧 Manual Setup](#-manual-setup)
  - [📦 Boilerplate Setup](#-boilerplate-setup)
  - [🎯 Custom Project Setup](#-custom-project-setup)
- [🔗 Links](#-links)
  - [Development URLs](#development-urls)
  - [Documentation](#documentation)
  - [Key Commands](#key-commands)

---

## 📋 Setup Prerequisites

Before starting, ensure you have:

1. **Docker & Docker Compose** installed and running
2. **Node.js** (v20 or higher) installed
3. **Git** installed
4. **PostgreSQL Database** created and configured

### Prerequisites Documentation

📖 **[Docker Setup Guide](docker.md)** - Install Docker and start containers

📖 **[Database Creation Guide](database.md#database-creation)** - Create PostgreSQL database and configure environment

> **⚠️ Important**: If you plan to use `setup.sh` for project setup, make sure to update the database credentials in `env-example-relational` file **before** running the script, as `setup.sh` copies this file to `.env` during execution.

---

## 🚀 Using Setup Script

📖 **[Setup Script Documentation](setup-script.md)** - Complete guide for automated project setup

The setup script handles everything automatically:

- Environment configuration
- Dependency installation
- Database setup
- Project customization
- Entity generation (for custom projects)
- Application startup

---

## 🔧 Manual Setup

### 📦 Boilerplate Setup

Get the base boilerplate application running with default modules (User, User-Device, Role, Status, File, Session, Biometric-Challenge, Social).

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Migrations:**

   ```bash
   npm run migration:run
   ```

3. **Run Seeders:**

   ```bash
   npm run seed:run:relational
   ```

4. **Start Application:**

   ```bash
   npm run start:dev
   ```

### 🎯 Custom Project Setup

Add your own entities and schema to create a custom application.

**Prerequisites:**

1. **Custom SQL Schema**: Add your custom SQL schema to the `.hygen/generate-migration/sql-script.sql` file
2. **Entity Schema JSON**: Create `.hygen-entities-generator/entities-generator.json`

**Setup Steps:**

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Generate Migration from SQL File:**

   ```bash
   npm run generate:migration-from-sql
   ```

3. **Run Migrations:**

   ```bash
   npm run migration:run
   ```

4. **Run Seeders:**

   ```bash
   npm run seed:run:relational
   ```

5. **Generate Custom Entities:**

   ```bash
   npm run generate:entities
   ```

6. **Start Application:**

   ```bash
   npm run start:dev
   ```

---

## 🔗 Links

### Development URLs

- **API Server**: <http://localhost:3000>
- **Swagger Documentation**: <http://localhost:3000/docs>
- **Database Admin (Adminer)**: <http://localhost:8080>
- **Email Testing (Maildev)**: <http://localhost:1080>

### Documentation

📖 **[Complete Documentation](readme.md)** - Full documentation with table of contents

### Key Commands

```bash
# Setup & Development
npm run setup                       # Complete project setup
npm run start:dev                   # Development server
npm run build                       # Production build

# Database
npm run generate:migration-from-sql # create migrations from sql file
npm run migration:run               # Run migrations
npm run seed:run:relational         # Run seeders

# Code Generation
npm run generate:migration          # Generate migrations from sql in interactive mode
npm run generate:entities           # Generate from JSON schema
npm run generate:resource           # Interactive resource generation
npm run generate:sub-entity         # Interactive sub-entities generation
npm run generate:enum               # Interactive enum generation
npm run generate:relationship       # Interactive relationship generation

# Testing
npm run test                    # Unit tests
npm run test:e2e                # End-to-end tests
npm run lint                    # Code linting
```

---

Previous: [Table of Contents](readme.md)

Next: [Docker](docker.md)
