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
# Step 5: Run migrations
# ---------------------------
echo "🗄️  Running migrations..."
npm run migration:run

# ---------------------------
# Step 6: Run seeders
# ---------------------------
echo "🗄️  Running seeders..."
npm run seed:run:relational

# ---------------------------
# Step 7: Generate entities (only if custom schema chosen)
# ---------------------------
if [ "$SETUP_CHOICE" == "2" ]; then
  echo "⚡ Generating entities from schema..."
  npm run generate:entities
else
  echo "⏭️  Skipping entity generation (boilerplate setup selected)"
fi

# ---------------------------
# Step 8: Build project
# ---------------------------
echo "🚀  Creating Build..."
npm run build

# ---------------------------
# Step 9: Start project
# ---------------------------
echo "🚀  Starting project..."
npm run start

echo "🎉  Setup completed successfully!"
