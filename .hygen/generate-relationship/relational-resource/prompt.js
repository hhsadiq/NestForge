const fs = require('fs');
const path = require('path');

module.exports = async (args, prompter) => {
  const dataFilePath = args.dataFile || process.env.DATA_FILE;

  // If data file is provided and exists, use it
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

      if (parsed && typeof parsed !== 'object') {
        console.error('❌ JSON must be an object of relation');
        process.exit(1);
      }

      const result = {
        sourceEntityName: parsed.sourceEntityName,
        sourceEntityParent: parsed.sourceEntityParent || null,
        fieldName: parsed.fieldName,
        relationType: parsed.relationType,
        relationEntityParent: parsed.relationEntityParent || null,
        relationEntityName: parsed.relationEntityName,
        sourceColumnName: parsed.sourceColumnName,
        relationFieldName: parsed.relationFieldName || null,
      };

      console.log(
        '\n📦 Using entity relation definition from file:',
        dataFilePath,
      );
      return result;
    } catch (err) {
      console.error(`❌ Error parsing JSON: ${err.message}`);
      process.exit(1);
    }
  }

  // If no valid data file provided, use interactive prompts
  console.log(
    'ℹ️  No valid relation definition file found, switching to interactive mode...',
  );
  try {
    const baseAnswers = await prompter.prompt([
      {
        type: 'input',
        name: 'sourceEntityName',
        message: 'What is the source entity name (where relation is added)?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Source entity name is required.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'sourceEntityParent',
        message:
          'What is the parent of the source entity? (press enter to skip)',
      },
      {
        type: 'input',
        name: 'relationEntityName',
        message: 'Target entity name to create relationship with?',
        validate: (input) => {
          if (!input.trim()) {
            return 'Related entity name is required.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'relationEntityParent',
        message:
          'What is the parent of the related entity? (press enter to skip)',
      },
      {
        type: 'select',
        name: 'relationType',
        message: 'Select the relation type:',
        choices: [
          { name: 'ManyToOne', value: 'ManyToOne' },
          { name: 'OneToMany', value: 'OneToMany' },
          { name: 'OneToOne', value: 'OneToOne' },
          { name: 'ManyToMany', value: 'ManyToMany' },
        ],
      },
    ]);

    let relationFieldName = null;
    if (baseAnswers.relationType === 'OneToMany') {
      const relFieldAns = await prompter.prompt({
        type: 'input',
        name: 'relationFieldName',
        message: 'What is the field name on the related entity?(banner_image)',
        validate: (input) => {
          if (!input.trim()) {
            return 'Related entity field name is required for OneToMany.';
          }
          return true;
        },
      });
      relationFieldName = relFieldAns.relationFieldName || null;
    }

    const fieldAnswer = await prompter.prompt([
      {
        type: 'input',
        name: 'fieldName',
        message: 'What is the field name on the source entity?(banner_image)',
        validate: (input) => {
          if (!input.trim()) {
            return 'Field name is required.';
          }
          return true;
        },
      },
    ]);

    let sourceColumnName = null;
    if (baseAnswers.relationType !== 'OneToMany') {
      const colAnswer = await prompter.prompt({
        type: 'input',
        name: 'sourceColumnName',
        message:
          'What is the source column name (e.g., foreign key column)? (banner_image_id)',
        validate: (input) => {
          if (!input.trim()) {
            return 'Source column name is required.';
          }
          return true;
        },
      });
      sourceColumnName = colAnswer.sourceColumnName;
    }

    return {
      ...baseAnswers,
      relationFieldName,
      ...fieldAnswer,
      sourceColumnName,
    };
  } catch (err) {
    console.error(`❌ Error during interactive prompts: ${err}`);
    process.exit(1);
  }
};
