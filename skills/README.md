# FaasJS Agent Skills

Agent skills for common FaasJS workflows.

## Essential Skills

Start here. These background skills are auto-applied to prevent common mistakes.

### `faasjs-best-practices`

Core FaasJS knowledge, best practices, and gotchas.

## Installation

```bash
npx skills add faasjs/faasjs
```

## Usage

**Background skill** (`faasjs-best-practices`) is automatically applied when relevant, including testability and unit testing guidance.

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
