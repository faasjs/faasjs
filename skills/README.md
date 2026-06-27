# FaasJS Agent Skills

Agent skills for common FaasJS workflows.

## Skills

Install this repository's skills to give agents focused FaasJS workflow guidance:

- `faasjs-best-practices`: Global fallback rules, validation gates, and routing to narrower FaasJS skills.
- `faasjs-project-workflow`: Project setup, file layout, config, CLI, naming, comments, and shared testing.
- `faasjs-react-ant-design`: React, `@faasjs/ant-design`, request flows, CRUD screens, and React tests.
- `faasjs-api-jobs`: `.api.ts`, `defineApi`, HTTP helpers, middleware, jobs, schedulers, and workers.
- `faasjs-workflow`: `@faasjs/workflow`, persistent definitions, step execution, recovery, leases, and workflow tests.
- `faasjs-pg`: `@faasjs/pg`, table types, `QueryBuilder`, migrations, and PostgreSQL tests.
- `faasjs-plugins-runtime`: Plugins, injected fields, logger usage, runtime config, and Node utilities.
- `faasjs-utils-data`: `@faasjs/utils`, JSON, YAML, streams, validation helpers, and path guards.
- `faasjs-specs`: Normative `faas.yaml`, routing, HTTP protocol, and plugin specifications.

## Installation

```bash
npx skills add faasjs/faasjs
```

## Usage

The broad `faasjs-best-practices` skill is a fallback. For focused work, invoke or rely on the narrower skills above so agents load only the references needed for the task.

## Contributing

Each skill follows the [Agent Skills open standard](https://github.com/anthropics/skills):

1. Create a directory under `skills/` with the skill name, prefixed with `faasjs-`.
2. Add a `SKILL.md` file with YAML frontmatter:
   ```yaml
   ---
   name: faasjs-skill-name
   description: Use when ...
   ---
   ```
3. Keep `SKILL.md` concise and put detailed guides in `references/guidelines/` or specs in `references/specs/`.
4. Keep source links inside the same skill only. When a guide or spec needs to mention another FaasJS skill's guide/spec, use the plain guide/spec name; `@faasjs/docgen` injects public docs-site links during generation.
