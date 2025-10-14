const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

/**
 * Extract table names from CREATE TABLE statements in SQL content
 * @param {string} sqlContent - The SQL content to parse
 * @returns {string[]} Array of table names
 */
function extractTableNames(sqlContent) {
  const tableNames = [];
  
  // Regex to match CREATE TABLE statements with or without quotes (case insensitive)
  // Matches: CREATE TABLE "table_name" or CREATE TABLE table_name
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"?([a-zA-Z_][a-zA-Z0-9_]*)"?/gi;
  
  let match;
  while ((match = createTableRegex.exec(sqlContent)) !== null) {
    const tableName = match[1];
    if (tableName && !tableNames.includes(tableName)) {
      tableNames.push(tableName);
    }
  }
  
  // Sort tables in reverse order to handle foreign key dependencies
  // Tables with foreign keys should be dropped first
  return tableNames.reverse();
}

/**
 * Extract function names from CREATE FUNCTION statements in SQL content
 * @param {string} sqlContent - The SQL content to parse
 * @returns {string[]} Array of function names
 */
function extractFunctionNames(sqlContent) {
  const functionNames = [];
  
  // Regex to match CREATE FUNCTION statements (case insensitive)
  const createFunctionRegex = /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi;
  
  let match;
  while ((match = createFunctionRegex.exec(sqlContent)) !== null) {
    const functionName = match[1];
    if (functionName && !functionNames.includes(functionName)) {
      functionNames.push(functionName);
    }
  }
  
  return functionNames;
}

/**
 * Strip comments from SQL content
 * @param {string} sqlContent - The SQL content to clean
 * @returns {string} SQL content without comments
 */
function stripComments(sqlContent) {
  // Remove single-line comments (-- comment)
  let cleaned = sqlContent.replace(/--.*$/gm, '');
  
  // Remove multi-line comments (/* comment */)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove empty lines and trim whitespace
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
  
  return cleaned;
}

async function generateMigration() {
  try {
    const sqlScriptPath = path.join(__dirname, '..', 'sql-script.sql');
    
    // Check if sql-script.sql exists and has content
    if (!fs.existsSync(sqlScriptPath)) {
      console.error('❌ sql-script.sql file not found in .hygen/generate-migration/');
      console.log('👉 Please create the file and add your SQL script first.');
      return;
    }

    const sqlContent = fs.readFileSync(sqlScriptPath, 'utf-8').trim();
    
    if (!sqlContent || sqlContent.includes('-- Copy your SQL script here')) {
      console.error('❌ sql-script.sql file is empty or contains only template content');
      console.log('👉 Please add your SQL script to the file first.');
      return;
    }

    // Get migration name from user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const migrationName = await new Promise((resolve) => {
      rl.question('Enter migration name (e.g., project-schema): ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });

    if (!migrationName) {
      console.error('❌ Migration name is required');
      return;
    }

    console.log(`\n🚀 Creating migration: ${migrationName}`);
    
    // Create migration using TypeORM command
    const migrationPath = `src/database/migrations/${migrationName}`;
    console.log(`📝 Running: npm run migration:create ${migrationPath}`);
    
    const { stdout, stderr } = await execAsync(`npm run migration:create ${migrationPath}`);
    
    if (stderr) {
      if (stderr.includes('ExperimentalWarning: Importing JSON modules')) {
        console.warn('⚠️ Ignoring Node.js warning:', stderr);
      } else if (!stderr.includes('Migration has been generated successfully')) {
        console.error('❌ Error creating migration:', stderr);
        return;
      }
    }

    console.log('✅ Migration file created successfully');

    // Find the generated migration file
    const migrationsDir = path.join(process.cwd(), 'src', 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir);
    const migrationFile = files.find(file => file.includes(migrationName) && file.endsWith('.ts'));
    
    if (!migrationFile) {
      console.error('❌ Could not find the generated migration file');
      return;
    }

    const migrationFilePath = path.join(migrationsDir, migrationFile);
    console.log(`📝 Found migration file: ${migrationFile}`);

    // Read the generated migration file
    let migrationContent = fs.readFileSync(migrationFilePath, 'utf-8');
    console.log('📄 Original migration content:');
    console.log(migrationContent);

    // Replace the up method with our SQL script
    // Strip comments from SQL content and escape $$ delimiters for PostgreSQL functions
    const cleanedSqlContent = stripComments(sqlContent);
    const escapedSqlContent = cleanedSqlContent.replace(/\$\$/g, '\\$\\$');
    
    const upMethodRegex = /public async up\(queryRunner: QueryRunner\): Promise<void> \{\s*\}/;
    const upReplacement = `public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
${escapedSqlContent}
    \`);
  }`;

    console.log('🔍 Testing up method regex...');
    console.log('Regex matches:', upMethodRegex.test(migrationContent));
    
    migrationContent = migrationContent.replace(upMethodRegex, upReplacement);

    // Parse SQL to extract table names and function names for DROP statements
    const tableNames = extractTableNames(sqlContent);
    const functionNames = extractFunctionNames(sqlContent);
    console.log('📋 Found tables to drop:', tableNames);
    console.log('📋 Found functions to drop:', functionNames);
    
    // Generate DROP TABLE statements with CASCADE
    const dropTableStatements = tableNames.map(tableName => 
      `DROP TABLE IF EXISTS ${tableName} CASCADE;`
    ).join('\n    ');
    
    // Generate DROP FUNCTION statements
    const dropFunctionStatements = functionNames.map(funcName => 
      `DROP FUNCTION IF EXISTS ${funcName} CASCADE;`
    ).join('\n    ');
    
    // Combine all DROP statements (functions first, then tables)
    const allDropStatements = dropFunctionStatements + (dropFunctionStatements && dropTableStatements ? '\n    ' : '') + dropTableStatements;

    // Replace the down method with proper DROP statements
    const downMethodRegex = /public async down\(queryRunner: QueryRunner\): Promise<void> \{\s*\}/;
    const downReplacement = `public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
${allDropStatements}
    \`);
  }`;

    console.log('🔍 Testing down method regex...');
    console.log('Regex matches:', downMethodRegex.test(migrationContent));
    
    migrationContent = migrationContent.replace(downMethodRegex, downReplacement);

    // Write the updated migration file
    fs.writeFileSync(migrationFilePath, migrationContent);

    console.log('✅ Migration file updated with your SQL script');
    console.log(`📁 Migration file: ${migrationFilePath}`);
    console.log('\n🎉 Migration generation completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review the generated migration file');

  } catch (error) {
    console.error('❌ Error generating migration:', error.message);
  }
}

// Run the generator
generateMigration();
