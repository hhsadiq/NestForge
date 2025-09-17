const fs = require('fs');
const path = require('path');
const pluralize = require('pluralize');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  if (
    dataFilePath &&
    fs.existsSync(path.resolve(process.cwd(), dataFilePath))
  ) {
    const absPath = path.resolve(process.cwd(), dataFilePath);
    if (!fs.existsSync(absPath)) {
      console.error(`❌ Data file not found: ${absPath}`);
      process.exit(1);
    }

    try {
      const raw = fs.readFileSync(absPath, 'utf8');
      const parsed = JSON.parse(raw);

      // Handle both single enum object and array of entities
      // This is a single enum object from process-entity.json
      if (!parsed.enumName || !parsed.enumValues) {
        console.error(
          '❌ JSON must be a valid enum object with name and values',
        );
        process.exit(1);
      }

      // Check if enum file already exists
      let moduleName = parsed.entityParent
        ? parsed.entityParent
        : parsed.entityName;

      // Ensure values is properly set
      const result = {
        ...parsed,
        moduleName: moduleName,
      };

      return result;
    } catch (err) {
      console.error(`❌ Error parsing JSON: ${err.message}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log(
    'ℹ️  No valid entity definition file found, switching to interactive mode...',
  );
  try {
    const result = await prompter.prompt([
      {
        type: 'input',
        name: 'enumName',
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
        message: 'Enter enum values (comma separated) e.g. ABC, XYZ',
        validate: (input) => {
          if (!input.trim()) {
            return 'At least one enum value is required';
          }
          return true;
        },
      },
    ]);

    // Calculate moduleName based on entityParent
    result.moduleName = result.entityParent
      ? result.entityParent
      : result.entityName;

    // Convert enumValues to values array (manual processing since filter didn't work)
    if (typeof result.enumValues === 'string') {
      result.enumValues = result.enumValues
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val.length > 0);
    }

    return result;
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};
