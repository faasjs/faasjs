# FaasJS Agent Skills

Agent skills for common FaasJS workflows.

## Essential Skills

Start here. These background skills are auto-applied to prevent common mistakes.

### `faasjs-best-practices`

Core FaasJS knowledge:

- [File Conventions](./faasjs-best-practices/file-conventions.md)
- [defineFunc Guide](./faasjs-best-practices/define-func.md)
- [Knex Rules](./faasjs-best-practices/knex.md)

### `faasjs-unit-testing`

FaasJS unit testing playbook:

- [Test-only Workflow](./faasjs-unit-testing/test-only.md)
- [Shared Testing Kit](./faasjs-unit-testing/shared-testing.md)
- [Test Matrix](./faasjs-unit-testing/test-matrix.md)

## Installation

```bash
npx skills add faasjs/faasjs
```

## Usage

**Background skills** (`faasjs-best-practices`, `faasjs-unit-testing`) are automatically applied when relevant.

## Contributing

Each skill follows the [Agent Skills open standard](https://github.com/anthropics/skills):

1. Create a directory under `skills/` with the skill name (prefix with `faasjs-`)
2. Add a `SKILL.md` file with YAML frontmatter:
   ```yaml
   ---
   name: faasjs-skill-name
   description: Brief description
   ---
   ```
3. For complex skills, add additional `.md` files and reference them from `SKILL.md`
