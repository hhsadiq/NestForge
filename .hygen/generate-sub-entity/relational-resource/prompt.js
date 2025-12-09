const fs = require('fs');
const path = require('path');

/**
 * Processes functionalities array to handle findAllWithSearch preference
 * If both findAll and findAllWithSearch exist, prefer findAllWithSearch (remove findAll)
 * @param {string[]} functionalities - Array of functionality strings
 * @returns {string[]} - Processed functionalities array
 */
function processFunctionalities(functionalities) {
  if (!Array.isArray(functionalities)) {
    return functionalities;
  }

  const hasFindAll = functionalities.includes('findAll');
  const hasFindAllWithSearch = functionalities.includes('findAllWithSearch');

  // If both exist, remove findAll and keep findAllWithSearch
  if (hasFindAll && hasFindAllWithSearch) {
    return functionalities.filter((func) => func !== 'findAll');
  }

  return functionalities;
}

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  // If data file is provided and exists
  if (
    dataFilePath &&
    fs.existsSync(path.resolve(process.cwd(), dataFilePath))
  ) {
    try {
      const raw = fs.readFileSync(
        path.resolve(process.cwd(), dataFilePath),
        'utf8',
      );
      const parsed = JSON.parse(raw);

      // Process functionalities to handle findAllWithSearch preference
      const rawFunctionalities = parsed.functionalities ?? [
        'create',
        'findAll',
        'findOne',
        'update',
        'delete',
      ];
      const processedFunctionalities =
        processFunctionalities(rawFunctionalities);

      const result = {
        parent: parsed.parent,
        name: parsed.name,
        isAddTestCase: parsed.isAddTestCase,
        functionalities: processedFunctionalities,
        enums: parsed.enums ?? [],
        fields: Array.isArray(parsed.fields)
          ? parsed.fields.map((field) => ({
              name: field.name,
              type: field.associatedEnumName ? null : field.type,
              optional: field.optional,
              customType: field.customType,
              example: field.example,
              includeInDTO: field.dto,
              associatedEnumName: field.associatedEnumName,
              unique: field.unique,
            }))
          : [],
      };

      console.log('\n📦 Using entity definition from file:', dataFilePath);
      return result;
    } catch (err) {
      console.error(`❌ Error processing JSON file: ${err}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log(
    'ℹ️  No valid entity definition file found, switching to interactive mode...',
  );
  try {
    return await prompter.prompt([
      {
        type: 'input',
        name: 'parent',
        message: 'What is the parent entity name?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Parent entity name is required. Please provide a valid name.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the sub entity name?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Sub entity name is required. Please provide a valid name.';
          }
          return true;
        },
      },
    ]);
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};
