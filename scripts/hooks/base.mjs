/**
 * base.mjs — shared context builder and pipeline runner
 * Used by inject-context.mjs (PreToolUse hook)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Parse stdin JSON and resolve the target file path.
 * Strips $CLAUDE_PROJECT_DIR prefix so paths match regex routes (^src/...).
 */
export function buildContext(rawInput) {
  const input = JSON.parse(rawInput);
  const toolName = input.tool_name || '';
  const rawPath =
    input.tool_input?.file_path ||
    input.tool_input?.path ||
    '';

  const projectRoot = process.env.CLAUDE_PROJECT_DIR || process.cwd();

  // Strip absolute project root to get relative path (e.g. src/bookings/...)
  const filePath = rawPath.startsWith(projectRoot)
    ? rawPath.slice(projectRoot.length).replace(/^\//, '')
    : rawPath;

  // Check if the file already exists on disk (relevant for Write — new vs overwrite)
  let isNewFile = false;
  try {
    readFileSync(rawPath.startsWith('/') ? rawPath : resolve(projectRoot, rawPath));
    isNewFile = false;
  } catch {
    isNewFile = true;
  }

  return { toolName, filePath, rawPath, projectRoot, isNewFile, input };
}

/**
 * Run middlewares in order. Each middleware returns { block, context } or { context }.
 * If any middleware returns { block: true }, exit 2 immediately.
 * Otherwise collect all context strings and output as additionalContext JSON.
 */
export function runPipeline(ctx, middlewares) {
  const contextParts = [];

  for (const middleware of middlewares) {
    const result = middleware(ctx);
    if (result.block) {
      // Exit 2 — agent is blocked. Message goes to stderr.
      if (result.message) process.stderr.write(result.message + '\n');
      process.exit(2);
    }
    if (result.context) {
      contextParts.push(result.context);
    }
  }

  if (contextParts.length > 0) {
    const combined = contextParts.join('\n\n');
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext: combined,
        },
      })
    );
  }

  process.exit(0);
}

/**
 * Read only the ## Inject section from a doc file.
 * Falls back to the full file content if section not found.
 */
export function readInjectSection(docPath, projectRoot) {
  try {
    const fullPath = resolve(projectRoot, docPath);
    const content = readFileSync(fullPath, 'utf8');
    const injectMatch = content.match(/## Inject\n([\s\S]*?)(?=\n## |$)/);
    return injectMatch
      ? `Context from ${docPath}:\n${injectMatch[1].trim()}`
      : `Context from ${docPath}:\n${content.trim()}`;
  } catch {
    return null;
  }
}
