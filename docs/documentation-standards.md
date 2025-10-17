# Documentation Standards

Quick reference for maintaining consistent NestForge documentation.

## 📋 Quick Reference

### TOC Format
```markdown
## Table of Contents <!-- omit in toc -->

- [Section 1](#section-1)
- [Section 2](#section-2)
  - [Subsection 2.1](#subsection-21)
```

**Rules:**
- No self-referencing links (title/TOC in TOC)
- Use `<!-- omit in toc -->` comment
- 2-space indentation for subsections
- Match anchor links exactly

### Headings
- `#` - Document title (only one per document)
- `##` - Main sections  
- `###` - Subsections
- Use sentence case: "Installation and setup"
- Be descriptive: "Database Configuration" not "Config"

### Code Blocks
Always specify language:
```typescript
// TypeScript code
const example = 'value';
```

### Links
- **Internal**: `[Architecture Guide](architecture.md)`
- **External**: `[NestJS Docs](https://docs.nestjs.com/)`
- **Anchors**: `[Setup Script](setup-script.md#usage)`

### File Naming
- Use kebab-case: `setup-script.md`
- Be descriptive: `database-migrations.md` not `db.md`

## 📝 Content Guidelines

### Writing Style
- **Active voice**: "Run the command" not "The command should be run"
- **Be concise**: Get to the point quickly
- **Use bullet points**: For lists and steps
- **Include examples**: Show, don't just tell
- **Add prerequisites**: Always mention what's needed before starting

### Document Structure
1. **Overview** - Brief description of what the document covers
2. **Prerequisites** - What users need before starting
3. **Step-by-step instructions** - Clear, numbered steps
4. **Examples and code** - Practical demonstrations
5. **Troubleshooting** - Common issues and solutions
6. **References** - Links to related documentation

### Navigation
Include navigation links at the bottom:
```markdown
---

Previous: [Previous Document](previous-doc.md)

Next: [Next Document](next-doc.md)
```

## 🔗 Link Validation

### Common Issues to Avoid
- ❌ Broken file references → Ensure linked files exist
- ❌ Missing anchors → Ensure `#section-name` exists
- ❌ Wrong paths → Use `../` for parent directory
- ❌ Missing extensions → Always include `.md`

### Quick Checklist
- [ ] All internal links use relative paths
- [ ] All linked files exist
- [ ] Anchor links point to existing sections
- [ ] Navigation links use correct relative paths

## ✅ Review Checklist

### Before Submitting Changes
- [ ] TOC follows standard format
- [ ] All internal links work
- [ ] Code blocks have language specified
- [ ] File naming follows conventions
- [ ] Content is clear and concise
- [ ] Prerequisites are clearly stated
- [ ] Examples are complete and runnable
- [ ] Navigation links are included

### Quality Checks
- [ ] No typos or grammar errors
- [ ] Consistent terminology throughout
- [ ] Proper heading hierarchy
- [ ] Cross-references are accurate
- [ ] External links are valid

---

*This document should be updated as new standards are established.*
