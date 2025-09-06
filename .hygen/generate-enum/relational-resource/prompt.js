const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  if (!dataFilePath) {
    console.error('❌ No data file provided. Use --dataFile=path/to/file.json');
    process.exit(1);
  }

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
              entityName: entity.name,
              entityParent: entity.parent,
              moduleName: entity.parent ? 
                pluralize(entity.parent.toLowerCase()) : 
                pluralize(entity.name.toLowerCase())
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
};
