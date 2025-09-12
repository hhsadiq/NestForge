# Setup Script Documentation

The `scripts/setup.sh` script provides an automated way to set up your NestForge project from scratch.

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Prerequisites](#prerequisites)
- [What the Script Does](#what-the-script-does)
- [Interactive Prompts](#interactive-prompts)
  - [For Custom Project Setup](#for-custom-project-setup)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
- [Result](#result)
  - [Test User Credentials](#test-user-credentials)

---

## Prerequisites

📖 **[Setup Prerequisites](installing-and-running.md#-setup-prerequisites)** - Complete prerequisites checklist and documentation links

---

## What the Script Does

The setup script performs these steps automatically:

1. **📄 Environment Setup**
   - Creates `.env` file from `env-example-relational`
   - Ensures proper configuration

2. **📦 Dependencies Installation**
   - Runs `npm install` to install all dependencies

3. **🗄️ Database Setup**
   - Runs migrations to create base schema + your project schema
   - Executes seeders to populate initial data

4. **🔄 Project Customization**
   - Prompts for project name (kebab-case)
   - Renames the project using `npm run project:rename`

5. **⚡ Entity Generation** (Custom Project only)
   - Runs `npm run generate:entities` to create your custom entities
   - Generates controllers, services, DTOs, and database entities

6. **🚀 Build & Start**
   - Creates production build
   - Starts the application server

---

## Interactive Prompts

The script will ask you:

1. **Project Name**: Enter your project name in kebab-case (e.g., `my-awesome-project`)
2. **Setup Type**: Choose between:
   - **Boilerplate setup (skip entity generation)**: Get the base boilerplate application running
   - **Custom schema setup (generate entities from schema)**: Add your own entities and schema

### For Custom Project Setup

You need to prepare these files before running the script:

1. **Custom Migration File**: Add your schema to a new migration file
   - Reference: [Create a new migration](database.md#create-a-new-migration-without-existing-entities)
2. **Entity Schema JSON**: Create `.hygen-entities-generator/entities-generator.json`
   - Sample: `.hygen-sample-files/sample-entities-generator.json`

---

## Usage

1. **Run the setup script:**

   ```bash
   npm run setup
   ```

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running: `docker compose up -d postgres`
   - Verify database credentials in `env-example-relational`
   - Check if database exists

2. **Migration Errors**
   - Ensure base schema migration exists.
   - Ensure don't repeat any action in your custom migration file that already done in base schema migration file
   - Check for syntax errors in custom migration files

3. **Entity Generation Errors**
   - Verify JSON schema format in `entities-generator.json`
   - Check sample files for reference

## Result

After successful completion, you'll have:

- **API Server**: <http://localhost:3000>
- **Swagger Documentation**: <http://localhost:3000/docs>
- **Database Admin**: <http://localhost:8080>

A fully functional NestJS API ready for development and testing!

### Test User Credentials

A default user is created in the database with the following credentials:

- **Email**: `admin@example.com`
- **Password**: `secret`

You can test the project by logging in with these credentials.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Docker](docker.md)
