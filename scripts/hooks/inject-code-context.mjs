/**
 * inject-code-context.mjs — codeContext middleware
 *
 * All-matches routing: walks every route, injects every matching doc.
 * General docs inject first (layer context), specific docs inject last (domain context).
 * This means specific context is closest to recency-privileged position when the agent writes.
 */

import { readInjectSection } from './base.mjs';

/**
 * ROUTES — ordered general → specific.
 * All matching routes inject. First-match-wins is NOT used.
 * Add new routes in the right position (general layer catchalls at the bottom).
 */
const ROUTES = [
  // ── Cross-cutting: exceptions ──────────────────────────────────────────────
  [/src\/common\/exceptions\.ts$/, 'docs/cross-cutting/exceptions.md'],

  // ── Cross-cutting: file-placement (for any new file pattern) ──────────────
  [/docs\/cross-cutting\/file-placement\.md$/, null], // skip injecting docs into docs

  // ── Domain entities ────────────────────────────────────────────────────────
  [/\/domain\/(?!queries)[^/]+\.ts$/, 'docs/layers/domain.md'],
  [/\/domain\/queries\//, 'docs/layers/domain.md'],

  // ── DTOs ──────────────────────────────────────────────────────────────────
  [/\/dto\/[^/]+\.dto\.ts$/, 'docs/layers/dto.md'],

  // ── Controllers ───────────────────────────────────────────────────────────
  [/\.controller\.ts$/, 'docs/layers/controller.md'],

  // ── Services ──────────────────────────────────────────────────────────────
  [/\.service\.ts$/, 'docs/layers/service.md'],
  // Services also need exception context
  [/\.service\.ts$/, 'docs/cross-cutting/exceptions.md'],

  // ── Abstract repositories ─────────────────────────────────────────────────
  [/\.abstract\.repository\.ts$/, 'docs/layers/repository.md'],

  // ── Concrete repositories ─────────────────────────────────────────────────
  [/\/relational\/repositories\/[^/]+\.repository\.ts$/, 'docs/layers/repository.md'],

  // ── Mappers ────────────────────────────────────────────────────────────────
  [/\/relational\/mappers\/[^/]+\.mapper\.ts$/, 'docs/layers/mapper.md'],
  [/\/relational\/queries\/[^/]+\.mapper\.ts$/, 'docs/layers/mapper.md'],
];

/**
 * Modules that warrant a "no matching doc" warning.
 * Unmatched files under src/ that aren't modules/entities/configs get an alert.
 */
const SKIP_ALERT_PATTERNS = [
  /\.entity\.ts$/,         // TypeORM entities — conventions enforced by arch-validate
  /\.module\.ts$/,         // NestJS modules — no specific doc needed
  /\.enum\.ts$/,           // Enums — no specific doc needed
  /-queries\.const\.ts$/,  // Raw SQL constants — no specific doc needed
  /relational-persistence\.module\.ts$/,
  /\/config\//,
  /\/i18n\//,
  /\/database\//,
  /main\.ts$/,
  /app\.module\.ts$/,
];

/**
 * codeContext middleware factory
 */
export function codeContext() {
  return function (ctx) {
    const { filePath, projectRoot } = ctx;

    if (!filePath || !filePath.startsWith('src/')) {
      return {};
    }

    // Walk ALL routes, collect every matching doc (deduplicated by path)
    const seen = new Set();
    const docs = [];

    for (const [pattern, docPath] of ROUTES) {
      if (!pattern.test(filePath)) continue;
      if (!docPath) continue;
      if (seen.has(docPath)) continue;
      seen.add(docPath);

      const content = readInjectSection(docPath, projectRoot);
      if (content) {
        docs.push(content);
      }
    }

    if (docs.length > 0) {
      return { context: docs.join('\n\n---\n\n') };
    }

    // No doc matched — warn if this is a non-trivial src/ file
    const shouldAlert = !SKIP_ALERT_PATTERNS.some((p) => p.test(filePath));
    if (shouldAlert) {
      return {
        context: `⚠️  No context doc matched for: ${filePath}\nStop and check AGENTS.md routing table before editing. This file type may need a new leaf doc.`,
      };
    }

    return {};
  };
}
