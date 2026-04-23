# Target Users And Product Boundaries

Use this guide when evaluating framework changes that could affect FaasJS positioning, supported stacks, dependency policy, abstractions, or default workflows.

Its goal is to make product boundaries and framework trade-offs explicit, so contributors can review proposals against a shared standard.

This is a decision guide for framework direction. It is not marketing copy, a feature checklist, or a promise to optimize for every valid use case.

## Core Product Thesis

FaasJS is a React-only, agent-friendly full-stack TypeScript framework for teams that want predictable product delivery through clear conventions, low ambiguity, strong type safety, and minimal dependencies.

It optimizes for a strong default path across frontend, backend, and shared types. It does not aim to be a highly configurable framework or a framework that treats many frontend stacks as equally first-class.

In FaasJS, "agent-friendly" means code structure, APIs, and conventions should be easy for agents to generate, inspect, review, and refactor. It does not mean preferring AI-oriented novelty over sound engineering.

## Primary Users

FaasJS is primarily for developers and teams who:

- build admin panels, back-office systems, internal tools, BFF/API layers, SaaS products, and other business applications
- want one clear React-based full-stack path instead of many equally official styles
- care about code that is easy to read, review, refactor, and maintain over time
- want architecture that works well for both humans and AI agents
- prefer a smaller dependency surface and a more predictable upgrade story

These users usually value steady product delivery, shared conventions, and long-term maintainability more than maximum abstraction power or stack optionality.

## Non-Target Users

FaasJS is not primarily optimized for users who:

- want multiple frontend frameworks to be equally first-class
- want high configurability or plugin-driven architecture as a core design goal
- expect the framework to adapt to many competing coding styles
- prefer hidden magic and implicit behavior over explicit structure
- want official support for every UI stack and database combination

This does not mean such users cannot build with FaasJS. It means framework proposals should not be accepted mainly to satisfy these priorities.

## Product Fit Gradient

### Primary Fit

FaasJS is especially well-suited for:

- admin panels and back-office systems
- internal tools
- BFF and API projects
- typical SaaS products

These product types align strongly with FaasJS priorities: clear conventions, repeatable business workflows, predictable data handling, and maintainable full-stack code.

### Good Fit

FaasJS is also a good fit for:

- AI applications with standard product surfaces
- business websites that also need application behavior, APIs, dashboards, or authenticated areas

These products fit well when they benefit more from one predictable full-stack path than from stack variety or framework customization.

### Supported But Not Optimized

FaasJS can support:

- content-driven websites with stronger editorial or publishing-first needs
- projects with specialized requirements that pull toward broader stack optionality

These can still be built with FaasJS, but they should not define core framework direction.

## Main Path And Ecosystem Boundaries

### React

React is a core product boundary.

We choose a React-only path over multi-frontend support because it keeps the framework, documentation, templates, tooling, and contributor mental model simpler and more predictable.

We accept a narrower official stack boundary and lower appeal for teams that want frontend optionality.

Therefore, proposals that broaden official frontend scope need exceptional justification and are usually a poor fit for FaasJS.

### `@faasjs/ant-design`

`@faasjs/ant-design` is an important official ecosystem package and the recommended UI happy path for many business systems.

We choose a strong recommended UI path over complete UI neutrality because it reduces repeated scaffolding and speeds up common business product work.

We accept that this makes the official ecosystem less visually neutral and less optimized for every design culture.

Therefore, `@faasjs/ant-design` should remain deeply supported, but core APIs and architecture should not assume it is mandatory everywhere.

### `@faasjs/pg`

`@faasjs/pg` is an important official ecosystem package and the recommended database happy path for relational application work.

We choose a strong PostgreSQL-oriented happy path over a totally abstract database story because it gives users a practical default for common product development.

We accept a narrower official database story and less emphasis on speculative database-agnostic abstractions.

Therefore, core design should not be reshaped around multi-database flexibility unless there is a strong benefit to the main path.

## Design Priorities And Explicit Trade-offs

### 1. Readability Over Flexibility

We choose code and conventions that are easier for humans and agents to read over support for many equally official styles.

This means some flexible patterns will remain out of scope if they make review, refactoring, or generated code less predictable.

### 2. Convention Over Configurability

We choose a strong default path over a growing set of switches, options, and alternate workflows.

This means convenience for niche preferences does not usually justify new framework-level configuration.

### 3. Low Ambiguity Over Hidden Magic

We choose explicit structure and predictable behavior over clever indirection.

This means proposals that rely on implicit rules, surprising defaults, or invisible coupling should be treated with skepticism.

### 4. Minimal Dependencies Over Short-Term Convenience

We choose a smaller dependency surface over pulling in packages to solve every problem quickly.

This means new dependencies need to improve the main path enough to outweigh long-term costs in upgrades, auditing, security review, and maintenance.

### 5. Main-Path Strength Over Edge-Case Coverage

We choose changes that strengthen the common React full-stack path over abstractions mainly created for edge cases, alternate styles, or speculative future flexibility.

This means not every valid use case should produce a framework feature.

### 6. Agent Readability As A Real Quality Bar

We choose file structures, APIs, and conventions that help agents generate, inspect, review, and refactor code safely.

This means agent-friendliness is part of maintainability, not a reason to accept novelty or reduce engineering rigor.

### 7. Strong Ecosystem Recommendations Without Collapsing Core Boundaries

We choose to offer official happy paths where they help common product work, while keeping a distinction between framework core and ecosystem packages.

This means recommended packages can be first-class in docs and examples without becoming mandatory assumptions in core behavior.

## Proposal Review Rubric

Before accepting a framework proposal, ask:

1. Does it make the main React-only path clearer, stronger, or easier to adopt?
2. Does it improve readability for both humans and agents?
3. Does it reduce ambiguity instead of adding new implicit rules or equivalent alternatives?
4. Does it keep the default path simple, or does it move complexity into configuration, documentation, templates, or review?
5. Does it solve a common product need for primary users, rather than a niche or speculative case?
6. If it adds a dependency, is the long-term cost clearly worth it?
7. Does it preserve the boundary between core framework behavior and optional ecosystem choices?
8. Who pays the complexity cost if this is accepted?

If a proposal scores poorly on the first four questions, mainly serves non-target users, or spreads complexity across docs, templates, and contributor mental models, it is usually a poor fit for FaasJS.

## Positive Signals

Changes are usually a good fit when they:

- make the default path more obvious
- reduce repeated scaffolding in common business product work
- strengthen types and explicit contracts
- remove ambiguity or hidden behavior
- improve consistency across docs, templates, examples, and code generation
- keep optional ecosystem choices optional

## Likely Rejections

Proposals are usually a poor fit when they:

- add official support for more frontend frameworks
- introduce configuration mainly to avoid choosing a default path
- add abstractions mainly for rare edge cases or speculative future needs
- introduce dependencies mainly for convenience
- make core APIs depend on `@faasjs/ant-design`, `@faasjs/pg`, or another ecosystem choice being present everywhere
- expand scope mainly to satisfy users who want maximum stack variety

## Common Misreads To Avoid

- FaasJS should gradually support more frontend frameworks.
- FaasJS should become highly configurable to fit more coding styles.
- Official ecosystem recommendations should become hard requirements.
- Wider scope is automatically a better roadmap.
- Convenience alone is enough reason to add a dependency.
- Agent-friendly means optimizing for AI hype rather than maintainable engineering.
- A supported product type should automatically reshape the framework around its special needs.
