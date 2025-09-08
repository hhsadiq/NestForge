const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  if (dataFilePath && fs.existsSync(path.resolve(process.cwd(), dataFilePath))) {

    const absPath = path.resolve(process.cwd(), dataFilePath);
    if (!fs.existsSync(absPath)) {
      console.error(`❌ Data file not found: ${absPath}`);
      process.exit(1);
    }

    try {
      const raw = fs.readFileSync(absPath, 'utf8');
      const parsed = JSON.parse(raw);

      // Handle both single enum object and array of entities
      if (Array.isArray(parsed)) {
        // This is the full sample.json - extract enums
        const allEnums = [];
        
        for (const entity of parsed) {
          if (entity.enums && Array.isArray(entity.enums)) {
            for (const enumDef of entity.enums) {
              allEnums.push({
                name: enumDef.name,
                values: enumDef.values,
                entityName: enumDef.entityName,
                entityParent: enumDef.entityParent,
                moduleName: enumDef.entityParent ? 
                  pluralize(enumDef.entityParent.toLowerCase()) : 
                  pluralize(enumDef.entityName.toLowerCase())
              });
            }
          }
        }

        console.log(`\n📦 Found ${allEnums.length} enums to generate:`);
        allEnums.forEach(e => console.log(` - ${e.name} (in ${e.moduleName} module)`));

        return allEnums;
      } else {
        // This is a single enum object from process-entity.json
        if (!parsed.name || !parsed.values) {
          console.error('❌ JSON must be a valid enum object with name and values');
          process.exit(1);
        }

        // Check if enum file already exists
        const enumFileName = parsed.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
        const enumFilePath = `src/${parsed.moduleName}/enums/${enumFileName}.enum.ts`;
        if (fs.existsSync(enumFilePath)) {
          console.log(`⏭️  Skipping ${parsed.name}, already exists`);
          return null;
        }

        console.log(`\n📦 Generating enum: ${parsed.name} (in ${parsed.moduleName} module)`);
        return parsed;
      }
    } catch (err) {
      console.error(`❌ Error parsing JSON: ${err.message}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log('ℹ️  No valid entity definition file found, switching to interactive mode...');
  try {
    const result = await prompter.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the enum name?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Enum name is required';
          }
          return true;
        },
        format: (input) => input.trim(),
      },
      {
        type: 'input',
        name: 'entityName',
        message: 'What is the entity name?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Entity name is required';
          }
          return true;
        },
        format: (input) => input.trim(),
      },
      {
        type: 'input',
        name: 'entityParent',
        message:
          'What is the parent of the source entity? (press enter to skip)',
      },
      {
        type: 'input',
        name: 'enumValues',
        message: "Enter enum values (comma separated) e.g. ABC, XYZ",
        filter: (input) => {
          // Convert input into an array of trimmed strings
          return input
            .split(',')
            .map((val) => val.trim())
            .filter((val) => val.length > 0);
        },
        validate: (input) => {
          if (!input.trim()) {
            return 'At least one enum value is required';
          }
          return true;
        },
      },
    ]);

    // Calculate moduleName based on entityParent
    result.moduleName = result.entityParent ? 
      pluralize(result.entityParent.toLowerCase()) : 
      pluralize(result.entityName.toLowerCase());
    
    // Convert enumValues to values array
    result.values = result.enumValues;

    return result;
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};
