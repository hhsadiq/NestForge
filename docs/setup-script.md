# Setup Script Documentation

The `scripts/setup.sh` script provides an automated way to set up your project from scratch.

---

## Table of Contents

- [Setup Script Documentation](#setup-script-documentation)
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

Here's what happens when you run the setup script:

1. **Pick Your Setup Style**
   - You'll choose between a quick boilerplate setup or a custom schema setup (where you add your own entities).

2. **Name Your Project**
   - Enter your new project name (in kebab-case, like `my-cool-app`). The script will handle renaming everything for you.

3. **Environment Setup**
   - If you don't already have a `.env` file, the script will create one for you from the `env-example-relational`.

4. **Install & Build**
   - All dependencies are installed, and the project is built so you're ready to go.

5. **Migration from SQL Script (if you have one)**
   - If you’ve prepared a SQL script, the script will generate a migration from it automatically. Make sure to add your custom sql script to `.hygen/generate-migration/sql-script.sql`

6. **Review Time (Custom schema only)**
   - If you chose custom schema, you'll get a chance to review your entities and migration files before moving forward. You can pause here if you want to double-check anything.

7. **Run Migrations**
   - The database schema is set up for you.

8. **Seed the Database**
   - Initial data is loaded in so you can start testing right away.

9. **Generate Entities (Custom schema only)**
   - Your custom entities are generated from your schema.

10. **Build Again**
    - The project is rebuilt to include any new changes.

11. **Start the Server**
    - Your app launches and is ready for development!

---

## Interactive Prompts

The script will ask you:

1. **Project Name**: Enter your project name in kebab-case (e.g., `my-awesome-project`)
2. **Setup Type**: Choose between:
   - **Boilerplate setup (skip entity generation)**: Get the base boilerplate application running
   - **Custom schema setup (generate entities from schema)**: Add your own entities and schema

### For Custom Project Setup

You need to prepare these files before running the script:

1. **Custom Migration File**: Add your custom SQL schema to the `.hygen/generate-migration/sql-script.sql` file
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

Previous: [Project Rename](project-rename.md)

Next: [Architecture](architecture.md)
