#!/bin/bash

set -e  # exit on error
set -o pipefail

echo "🚀 Starting project setup..."

# ---------------------------
# Step 1: Choose setup mode
# ---------------------------
echo "⚙️  Choose setup mode:"
echo "1) Boilerplate setup (skip entity generation)"
echo "2) Custom schema setup (generate entities from schema)"
read -p "👉 Enter choice [1/2]: " SETUP_CHOICE

if [[ "$SETUP_CHOICE" != "1" && "$SETUP_CHOICE" != "2" ]]; then
  echo "❌  Invalid choice! Please enter 1 or 2."
  exit 1
fi

# ---------------------------
# Step 2: Rename project
# ---------------------------
read -p "👉 Enter new project name (kebab-case): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Project name cannot be empty!"
  exit 1
fi

echo "🔄 Renaming project to: $PROJECT_NAME"
npm run project:rename -- "$PROJECT_NAME"

# ---------------------------
# Step 3: Copy .env file
# ---------------------------
if [ ! -f ".env" ]; then
  echo "📄  Creating .env file from env-example-relational..."
  cp env-example-relational .env
else
  echo "ℹ️  .env file already exists. Skipping..."
fi

# ---------------------------
# Step 4: Install dependencies
# ---------------------------
echo "📦 Installing dependencies..."
npm install
npm run build

# ---------------------------
# Step 5: Generate migration from SQL script (if exists)
# ---------------------------
if [ -f ".hygen/generate-migration/sql-script.sql" ]; then
  echo "⚡ Generating migration from SQL script..."
  npm run generate:migration-from-sql
else
  echo "⏭️  No SQL script found, skipping migration generation"
fi

# ---------------------------
# Step 6: Review entities and migration (if custom schema chosen)
# ---------------------------
if [ "$SETUP_CHOICE" == "2" ]; then
  echo ""
  echo "📋 Entities and sql script files to review:"
  echo "   • Entities JSON: .hygen-entities-generator/entities-generator.json"
  echo "   • SQL script: .hygen/generate-migration/sql-script.sql"
  echo ""
  echo "📋 Generated files to review:"
  echo "   • Migration files: src/database/migrations/"
  echo ""
  echo "🔍 Please review the entities and migration files above."
  echo ""
  read -p "👉 Do you want to proceed with the setup? [y/N]: " PROCEED_CHOICE
  
  if [[ ! "$PROCEED_CHOICE" =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled by user. Please review the files and run the setup again when ready."
    exit 0
  fi
  echo "✅ Proceeding with setup..."
fi

# ---------------------------
# Step 7: Run migrations
# ---------------------------
echo "🗄️  Running migrations..."
npm run migration:run

# ---------------------------
# Step 8: Run seeders
# ---------------------------
echo "🗄️  Running seeders..."
npm run seed:run:relational

# ---------------------------
# Step 9: Generate entities (only if custom schema chosen)
# ---------------------------
if [ "$SETUP_CHOICE" == "2" ]; then
  echo "⚡ Generating entities from schema..."
  npm run generate:entities
else
  echo "⏭️  Skipping entity generation (boilerplate setup selected)"
fi

# ---------------------------
# Step 10: Build project
# ---------------------------
echo "🚀  Creating Build..."
npm run build

# ---------------------------
# Step 11: Start project
# ---------------------------
echo "🚀  Starting project..."
npm run start

echo "🎉  Setup completed successfully!"
