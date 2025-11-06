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
  if (dataFilePath && fs.existsSync(path.resolve(process.cwd(), dataFilePath))) {
    try {
      const raw = fs.readFileSync(path.resolve(process.cwd(), dataFilePath), 'utf8');
      const parsed = JSON.parse(raw);

      // Process functionalities to handle findAllWithSearch preference
      const rawFunctionalities =
        parsed.functionalities ?? [
          'create',
          'findAll',
          'findOne',
          'update',
          'delete',
        ];
      const processedFunctionalities =
        processFunctionalities(rawFunctionalities);

      const result = {
        isAddTestCase: parsed.isAddTestCase ?? true,
        functionalities: processedFunctionalities,
        name: parsed.name,
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
    const answers = await prompter.prompt([
      {
        type: 'confirm',
        name: 'isAddTestCase',
        message: 'Do you want to add test cases and mock data?',
        initial: true,
      },
      {
        type: 'multiselect',
        name: 'functionalities',
        message: 'Select the functionalities you want to include:',
        choices: [
          { name: 'create', value: 'create' },
          { name: 'findAll', value: 'findAll' },
          { name: 'findAllWithSearch', value: 'findAllWithSearch' },
          { name: 'findOne', value: 'findOne' },
          { name: 'update', value: 'update' },
          { name: 'delete', value: 'delete' },
        ],
      },
    ]);

    // Process functionalities from interactive prompts as well
    const processedFunctionalities = processFunctionalities(
      answers.functionalities,
    );

    return {
      ...answers,
      functionalities: processedFunctionalities,
      enums: [],
      fields: [],
    };
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};