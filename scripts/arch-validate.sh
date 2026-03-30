#!/usr/bin/env bash
# arch-validate.sh — PostToolUse hook
#
# Runs after every Edit and Write tool call.
# Checks the modified file for architecture violations.
# Exit 2 = blocking violation (agent must fix before proceeding).
# Exit 0 = clean.
#
# CRITICAL: Strip $CLAUDE_PROJECT_DIR from absolute paths before pattern matching.

INPUT=$(cat)
ABS_FILE=$(echo "$INPUT" | node -e "
  let d=''; process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    try { const p=JSON.parse(d); console.log(p.tool_input?.file_path||''); }
    catch { console.log(''); }
  });
" 2>/dev/null || echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null)

# Re-parse using node for reliability
ABS_FILE=$(echo "$INPUT" | node -e "
process.stdin.resume();
process.stdin.setEncoding('utf8');
let data = '';
process.stdin.on('data', (chunk) => data += chunk);
process.stdin.on('end', () => {
  try {
    const parsed = JSON.parse(data);
    console.log(parsed.tool_input?.file_path || '');
  } catch {
    console.log('');
  }
});
")

# Strip project root to get relative path
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
FILE="${ABS_FILE#"$PROJECT_ROOT/"}"

# Skip if no file or not in src/
if [ -z "$FILE" ] || [[ "$FILE" != src/* ]]; then
  exit 0
fi

# Skip if file doesn't exist (was deleted, or path is wrong)
if [ ! -f "$ABS_FILE" ]; then
  exit 0
fi

VIOLATIONS=""
WARNINGS=""

# ── 1. Domain layer must not import from TypeORM or infrastructure ─────────────
if [[ "$FILE" == src/*/domain/*.ts ]] && [[ "$FILE" != *.spec.ts ]] && [[ "$FILE" != *.test.ts ]]; then
  grep -qE "from ['\"]typeorm['\"]|from ['\"]@nestjs/typeorm['\"]" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Domain entity imports TypeORM — domain/ must be pure TypeScript with zero DB dependencies.\n   Fix: remove typeorm and @nestjs/typeorm imports from $FILE\n\n"

  grep -qE "from ['\"].*infrastructure/" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Domain entity imports from infrastructure/ layer — domain/ must not depend on persistence.\n   Fix: remove infrastructure/ imports from $FILE\n\n"
fi

# ── 2. Services must not directly inject TypeORM repositories ─────────────────
if [[ "$FILE" == src/*/*.service.ts ]]; then
  grep -q "@InjectRepository" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Service uses @InjectRepository — services must inject the abstract repository, not TypeORM Repository directly.\n   Fix: inject <Module>AbstractRepository instead of Repository<Entity>.\n\n"

  grep -qE "Repository<[A-Z]" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Service has TypeORM Repository<...> type — services must use the abstract repository interface.\n   Fix: replace Repository<EntityClass> with <Module>AbstractRepository.\n\n"
fi

# ── 3. Services must use @src/common/exceptions (not raw NestJS exceptions) ───
if [[ "$FILE" == src/*/*.service.ts ]]; then
  grep -qE "throw new (NotFoundException|BadRequestException|UnprocessableEntityException|ForbiddenException|UnauthorizedException|ConflictException)" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Service throws raw NestJS exception — use helpers from @src/common/exceptions instead.\n   Fix: import { NOT_FOUND, UNPROCESSABLE_ENTITY, BAD_REQUEST, FORBIDDEN } from '@src/common/exceptions'\n\n"
fi

# ── 4. Concrete repos must not import other concrete repos ────────────────────
if [[ "$FILE" == src/*/infrastructure/persistence/relational/repositories/*.repository.ts ]]; then
  grep -qE "from ['\"].*relational/repositories/" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ Concrete repository imports another concrete repository — cross-table joins belong in services or a shared module.\n   Fix: move cross-repo logic to a service or create a src/<a>-and-<b>/ common module.\n\n"
fi

# ── 5. Concrete repos must call mapper.toDomain() (not return raw entities) ───
if [[ "$FILE" == src/*/infrastructure/persistence/relational/repositories/*.repository.ts ]]; then
  # If repo has async methods that return but no toDomain call, likely missing mapper
  if grep -q "async find" "$ABS_FILE" 2>/dev/null; then
    if ! grep -q "\.toDomain(" "$ABS_FILE" 2>/dev/null; then
      VIOLATIONS+="❌ Concrete repository has find methods but no Mapper.toDomain() calls — raw DB entities must be mapped before returning.\n   Fix: call <Entity>Mapper.toDomain(entity) on every returned value.\n\n"
    fi
  fi
fi

# ── 6. No console.log / console.error / console.warn ─────────────────────────
if [[ "$FILE" == src/* ]] && \
   [[ "$FILE" != *.spec.ts ]] && \
   [[ "$FILE" != *.test.ts ]] && \
   [[ "$FILE" != src/*/logger*.ts ]]; then
  grep -qE "console\.(log|error|warn|info|debug)" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ console.* detected — use NestJS Logger instead.\n   Fix: import { Logger } from '@nestjs/common'; private readonly logger = new Logger('ClassName');\n\n"
fi

# ── 7. No export default ──────────────────────────────────────────────────────
if [[ "$FILE" == src/* ]] && \
   [[ "$FILE" != *.spec.ts ]] && \
   [[ "$FILE" != *.test.ts ]]; then
  grep -q "^export default" "$ABS_FILE" 2>/dev/null && \
    VIOLATIONS+="❌ export default detected — this codebase uses named exports only.\n   Fix: change to a named export (export class Foo / export const foo).\n\n"
fi

# ── 8. File placement defense-in-depth (catches files that bypassed structureCheck) ──
case "$FILE" in
  src/services/*)
    VIOLATIONS+="❌ Wrong directory: src/services/ — services go in src/<module>/<module>.service.ts\n\n" ;;
  src/repositories/*)
    VIOLATIONS+="❌ Wrong directory: src/repositories/ — repos go in src/<module>/infrastructure/persistence/relational/repositories/\n\n" ;;
  src/entities/*)
    VIOLATIONS+="❌ Wrong directory: src/entities/ — DB entities go in src/<module>/infrastructure/persistence/relational/entities/\n\n" ;;
  src/models/*)
    VIOLATIONS+="❌ Wrong directory: src/models/ — domain entities go in src/<module>/domain/\n\n" ;;
  src/helpers/*)
    VIOLATIONS+="❌ Wrong directory: src/helpers/ — shared helpers go in src/utils/ or src/common/\n\n" ;;
  src/types/*)
    VIOLATIONS+="❌ Wrong directory: src/types/ — shared types go in src/utils/types/\n\n" ;;
  src/*/entities/*)
    VIOLATIONS+="❌ Wrong path: src/<module>/entities/ — DB entities go in src/<module>/infrastructure/persistence/relational/entities/\n\n" ;;
  src/*/models/*)
    VIOLATIONS+="❌ Wrong path: src/<module>/models/ — domain entities go in src/<module>/domain/\n\n" ;;
  src/*/repositories/*)
    VIOLATIONS+="❌ Wrong path: src/<module>/repositories/ — repos go in src/<module>/infrastructure/persistence/relational/repositories/\n\n" ;;
esac

# ── Non-blocking warnings ─────────────────────────────────────────────────────
# as any / : any — prefer unknown with type guards
if [[ "$FILE" == src/* ]] && \
   [[ "$FILE" != *.spec.ts ]] && \
   [[ "$FILE" != *.test.ts ]] && \
   [[ "$FILE" != *.d.ts ]]; then
  grep -qE ": any[^[]|as any" "$ABS_FILE" 2>/dev/null && \
    WARNINGS+="⚠️  as any / : any detected — prefer unknown with type guards for better type safety.\n\n"
fi

# ── Output ────────────────────────────────────────────────────────────────────
if [ -n "$WARNINGS" ]; then
  echo -e "Arch warnings in $FILE:\n$WARNINGS" >&2
fi

if [ -n "$VIOLATIONS" ]; then
  echo -e "Architecture violations in $FILE — fix these before proceeding:\n\n$VIOLATIONS" >&2
  exit 2
fi

exit 0
