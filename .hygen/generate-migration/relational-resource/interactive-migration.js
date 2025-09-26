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
  
  // Regex to match CREATE TABLE statements (case insensitive)
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z_][a-zA-Z0-9_]*)/gi;
  
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

async function generateInteractiveMigration() {
  try {
    // Interactive SQL input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('📝 Enter your SQL script (press Ctrl+D when done):');
    const lines = [];
    
    for await (const line of rl) {
      lines.push(line);
    }
    
    const sqlContent = lines.join('\n').trim();
    rl.close();

    if (!sqlContent) {
      console.error('❌ No SQL content provided');
      return;
    }

    // Get migration name from user input
    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const migrationName = await new Promise((resolve) => {
      rl2.question('Enter migration name (e.g., project-schema): ', (answer) => {
        rl2.close();
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
    
    if (stderr && !stderr.includes('Migration has been generated successfully')) {
      console.error('❌ Error creating migration:', stderr);
      return;
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

    // Replace the up method with our SQL script
    const upMethodRegex = /public async up\(queryRunner: QueryRunner\): Promise<void> \{\s*\}/;
    const upReplacement = `public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
${sqlContent}
    \`);
  }`;

    migrationContent = migrationContent.replace(upMethodRegex, upReplacement);

    // Parse SQL to extract table names for DROP statements
    const tableNames = extractTableNames(sqlContent);
    console.log('📋 Found tables to drop:', tableNames);
    
    // Generate DROP TABLE statements with CASCADE
    const dropStatements = tableNames.map(tableName => 
      `DROP TABLE IF EXISTS ${tableName} CASCADE;`
    ).join('\n    ');

    // Replace the down method with proper DROP TABLE statements
    const downMethodRegex = /public async down\(queryRunner: QueryRunner\): Promise<void> \{\s*\}/;
    const downReplacement = `public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(\`
${dropStatements}
    \`);
  }`;

    migrationContent = migrationContent.replace(downMethodRegex, downReplacement);

    // Write the updated migration file
    fs.writeFileSync(migrationFilePath, migrationContent);

    console.log('✅ Migration file updated with your SQL script');
    console.log(`📁 Migration file: ${migrationFilePath}`);
    console.log('\n🎉 Migration generation completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review the generated migration file');
    console.log('   2. Run: npm run migration:run');

  } catch (error) {
    console.error('❌ Error generating migration:', error.message);
  }
}

// Run the interactive generator
generateInteractiveMigration();
