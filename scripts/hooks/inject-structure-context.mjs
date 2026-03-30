/**
 * inject-structure-context.mjs — structureCheck middleware
 *
 * Fires only on Write to NEW files under src/.
 * Blocks known-wrong paths before the file is created.
 * Injects file-placement.md context for valid new files.
 */

import { readInjectSection } from './base.mjs';

/**
 * Paths that agents frequently get wrong.
 * Each entry: [regex, redirect message]
 */
const BLOCKED_PATHS = [
  // Wrong top-level src directories (no standalone services/, repositories/, etc.)
  [
    /^src\/services\//,
    'Services live inside their feature module: src/<module>/<module>.service.ts — not in a top-level src/services/ folder.',
  ],
  [
    /^src\/repositories\//,
    'Repositories live inside their feature module: src/<module>/infrastructure/persistence/relational/repositories/ — not in a top-level src/repositories/ folder.',
  ],
  [
    /^src\/entities\//,
    'DB entities live inside their feature module: src/<module>/infrastructure/persistence/relational/entities/ — not in a top-level src/entities/ folder.',
  ],
  [
    /^src\/models\//,
    'Use src/<module>/domain/<entity>.ts for domain models — not a top-level src/models/ folder.',
  ],
  [
    /^src\/helpers\//,
    'Shared helpers go in src/utils/ or src/common/ — not in a top-level src/helpers/ folder.',
  ],
  [
    /^src\/types\//,
    'Shared types live in src/utils/types/ — not in a top-level src/types/ folder.',
  ],
  // Wrong paths inside a module
  [
    /^src\/[^/]+\/entities\//,
    'DB entities go in src/<module>/infrastructure/persistence/relational/entities/ — not directly in src/<module>/entities/.',
  ],
  [
    /^src\/[^/]+\/models\//,
    'Domain entities go in src/<module>/domain/ — not in src/<module>/models/.',
  ],
  [
    /^src\/[^/]+\/helpers\//,
    'Module-internal helpers go in src/utils/ or src/common/ — not in src/<module>/helpers/.',
  ],
  [
    /^src\/[^/]+\/repositories\//,
    'Repositories go in src/<module>/infrastructure/persistence/relational/repositories/ — not in src/<module>/repositories/.',
  ],
  [
    /^src\/[^/]+\/infrastructure\/[^/]+\.ts$/,
    'Files directly inside infrastructure/ are wrong. Use infrastructure/persistence/<module>.abstract.repository.ts or infrastructure/persistence/relational/entities|mappers|repositories/.',
  ],
  // Singular typos
  [
    /^src\/[^/]+\/domain\/queries\/[^/]+(?<!-query)\.ts$/,
    'Query result shapes should be named <name>-query.ts in src/<module>/domain/queries/.',
  ],
];

/**
 * Valid path patterns within a module (regex must match the full relative path)
 */
const VALID_MODULE_PATTERNS = [
  /^src\/[^/]+\/domain\//,
  /^src\/[^/]+\/dto\//,
  /^src\/[^/]+\/enums\//,
  /^src\/[^/]+\/infrastructure\/persistence\//,
  /^src\/[^/]+\/[^/]+\.(controller|service|module)\.ts$/,
  // shared cross-cutting paths
  /^src\/utils\//,
  /^src\/common\//,
  /^src\/config\//,
  /^src\/database\//,
  /^src\/database-helpers\//,
  /^src\/i18n\//,
];

/**
 * structureCheck middleware factory
 */
export function structureCheck() {
  return function (ctx) {
    const { toolName, filePath, isNewFile, projectRoot } = ctx;

    // Only fire on Write to new files under src/
    if (toolName !== 'Write' || !isNewFile || !filePath.startsWith('src/')) {
      return {};
    }

    // Check blocked paths first
    for (const [pattern, guidance] of BLOCKED_PATHS) {
      if (pattern.test(filePath)) {
        return {
          block: true,
          message: `BLOCKED: ${filePath}\n${guidance}\nSee docs/cross-cutting/file-placement.md for the full structure.`,
        };
      }
    }

    // Inject file-placement context for any valid new file in src/
    const placementDoc = readInjectSection(
      'docs/cross-cutting/file-placement.md',
      projectRoot
    );
    if (placementDoc) {
      return { context: placementDoc };
    }

    return {};
  };
}
