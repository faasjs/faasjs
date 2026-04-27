# Target Users And Product Boundaries

Use this guide when evaluating framework changes that could affect FaasJS positioning, supported stacks, dependency policy, abstractions, default workflows, templates, or contributor expectations.

Its goal is to make product boundaries and framework trade-offs explicit, so contributors can review proposals against a shared standard.

This is a decision guide for framework direction. It is not marketing copy, a feature checklist, or a promise to optimize for every valid use case.

## Core Product Thesis

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications.

It chooses a default stack for React UI, typed APIs, PostgreSQL, validation, routing, testing, project structure, plugins, and agent-readable conventions so teams can build predictable products without repeatedly assembling their own framework.

FaasJS optimizes for a strong default path across frontend, backend, data, tests, and shared types. It does not aim to be a highly configurable framework, a neutral collection of unopinionated utilities, or a framework that treats many frontend stacks, databases, and architecture styles as equally first-class.

In FaasJS, "agent-readable" means code structure, APIs, examples, and conventions should be easy for AI coding agents and human maintainers to generate, inspect, review, and refactor. It does not mean preferring AI-oriented novelty over sound engineering.

## What Curated Means

"Curated" means FaasJS makes a small number of strong official choices and makes those choices work well together.

The curated default path is:

- React for frontend applications
- `@faasjs/ant-design` and Ant Design for business UI components
- PostgreSQL for relational data
- `@faasjs/pg` for typed database workflows, queries, and migrations
- `@faasjs/jobs` for PostgreSQL-backed background jobs and scheduled job enqueueing
- `defineApi` for typed backend endpoints
- schema validation at system boundaries
- Vitest-based testing
- Vite Plus-powered development workflow
- plugin conventions for business-specific extension points
- best-practice guides and templates for AI coding agents and human maintainers

Users may replace parts of this stack, but FaasJS optimizes templates, documentation, examples, package design, and review standards for the curated path first.

## Primary Users

FaasJS is primarily for developers and teams who:

- build database-driven React business applications
- build admin panels, back-office systems, internal tools, SaaS dashboards, BFF/API layers, and business workflow systems
- want one chef-selected full-stack path instead of assembling React, API, database, testing, and UI conventions themselves
- care about code that is easy for humans and AI coding agents to read, review, refactor, and maintain over time
- want strong type safety across UI, API, validation, database, and tests
- prefer stable conventions and intentional dependencies over open-ended configurability

These users usually value steady product delivery, complete application slices, shared conventions, and long-term maintainability more than maximum abstraction power or stack optionality.

## Non-Target Users

FaasJS is not primarily optimized for users who:

- want multiple frontend frameworks to be equally first-class
- want every UI library, database, or deployment model to have the same official experience
- want high configurability or plugin-driven architecture as a goal for its own sake
- expect the framework to adapt to many competing coding styles
- prefer hidden magic and implicit behavior over explicit structure
- want a generator-heavy workflow to be the primary productivity mechanism
- want to optimize for content publishing, marketing pages, or highly bespoke frontend design before business application workflows

This does not mean such users cannot build with FaasJS. It means framework proposals should not be accepted mainly to satisfy these priorities.

## Product Fit Gradient

### Primary Fit

FaasJS is especially well-suited for database-driven React business applications such as:

- admin panels and back-office systems
- internal tools
- SaaS dashboards
- BFF and API projects for product frontends
- business workflow systems

These product types align strongly with FaasJS priorities: curated defaults, repeatable business workflows, predictable data handling, typed boundaries, and maintainable full-stack code.

### Good Fit

FaasJS is also a good fit for:

- AI applications with standard product surfaces, dashboards, APIs, authenticated areas, or business workflows
- business websites that also need application behavior, APIs, dashboards, or authenticated areas
- API-only services that benefit from FaasJS routing, typed APIs, plugins, testing, and Node utilities

These products fit well when they benefit more from one predictable full-stack path than from stack variety or framework customization.

### Supported But Not Optimized

FaasJS can support:

- content-driven websites with stronger editorial or publishing-first needs
- highly bespoke consumer frontends where UI choice is more important than business workflow speed
- projects with specialized requirements that pull toward broader stack optionality

These can still be built with FaasJS, but they should not define core framework direction.

## Main Path And Ecosystem Boundaries

### React

React is the official frontend stack and a core product boundary.

We choose a React-first path over multi-frontend support because it keeps the framework, documentation, templates, tooling, examples, and contributor mental model simpler and more predictable.

We accept a narrower official stack boundary and lower appeal for teams that want frontend optionality.

Therefore, proposals that broaden official frontend scope need exceptional justification and are usually a poor fit for FaasJS.

### `@faasjs/ant-design`

`@faasjs/ant-design` is the default business UI path for the curated stack.

We choose a strong Ant Design-based business UI path over complete UI neutrality because it reduces repeated scaffolding, supports reusable data-shaped UI components, and speeds up common admin, internal tool, and SaaS dashboard work.

We accept that this makes the official ecosystem less visually neutral and less optimized for every design culture.

Therefore, `@faasjs/ant-design` should remain deeply supported, but core APIs and architecture should not assume it is mandatory everywhere.

### `@faasjs/pg`

`@faasjs/pg` is the default relational database path for the curated stack.

We choose a strong PostgreSQL-oriented path over a totally abstract database story because it gives users a practical default for database-driven business applications.

We accept a narrower official database story and less emphasis on speculative database-agnostic abstractions.

Therefore, core design should not be reshaped around multi-database flexibility unless there is a strong benefit to the main path.

### Plugins

Plugins are the official business-specific extension mechanism.

They should carry project-specific concerns such as auth context, permissions, tenant context, request metadata, service clients, or other cross-cutting application behavior.

Plugins should make extension points explicit without turning FaasJS into a highly configurable framework where every choice becomes a switch.

## Auth And Permissions

Authentication and authorization are business-specific extension points.

FaasJS should not ship one mandatory auth system in core. Auth requirements vary too much across password login, SSO, OAuth, session storage, JWTs, multi-tenancy, RBAC, ABAC, and product-specific security policies.

Instead, `create-faas-app` may include a simple auth plugin demo that shows how to:

- inject current user context
- protect APIs
- connect frontend state with authenticated requests
- model permissions through project-specific plugins

This gives users a clear starting pattern without pretending that one auth abstraction fits every product.

## Official Batteries

Official batteries should follow the existing package layering and strengthen the curated path.

Current official batteries include:

- core runtime, routing, HTTP helpers, and typed API conventions
- React client bindings
- Ant Design business UI components
- PostgreSQL query, migration, and testing workflows
- PostgreSQL-backed background jobs and scheduled enqueue workflows
- Node utilities and plugin conventions
- dev tooling and templates

Potential future batteries such as seed data, fixtures, uploads, queues, and mailers should be evaluated by whether they strengthen database-driven React business applications and can be layered without bloating core.

## No Rails-style Generators

FaasJS is inspired by Rails' convention-over-configuration product experience, but it does not aim to recreate Rails-style generators as the primary productivity mechanism.

Rails generators helped humans create repetitive structure. FaasJS assumes AI coding agents can write that code directly when the framework provides clear conventions, examples, types, and best-practice guides.

Therefore, FaasJS should invest more in:

- stable file conventions
- high-quality templates
- copyable examples
- complete application slice guides
- typed APIs and schemas
- predictable tests
- agent-readable project structure

It should not grow a large generator command surface unless a generator clearly strengthens the curated path and cannot be replaced by better conventions, examples, or agent guidance.

## Replaceability

FaasJS allows teams to replace parts of the curated stack, but replacement paths are escape hatches, not parallel first-class tracks.

The official documentation, templates, examples, and framework design should optimize for the curated path first. Alternative UI libraries, databases, validation strategies, or architecture styles should not drive core complexity unless they also improve the main path.

This boundary lets advanced teams adapt FaasJS to their needs while keeping the default experience focused and teachable.

## Differentiation

FaasJS differs from assembling Next.js, Prisma, shadcn/ui, NestJS, Rails, Redwood, or similar tools by optimizing the integrated business-application path instead of leaving teams to compose and govern their own stack.

Its value is:

- fewer architecture decisions before product work starts
- one official React business UI path
- typed API conventions designed for frontend/backend collaboration
- PostgreSQL-first database workflows
- templates and guides that show complete application slices
- conventions that are easy for AI coding agents to follow
- less framework-neutral abstraction and more practical product delivery

## Design Priorities And Explicit Trade-offs

### 1. Curated Defaults Over Ecosystem Assembly

We choose a chef-selected default stack over asking each project to assemble and govern its own framework from many independent tools.

This means FaasJS should strengthen the official React, Ant Design, PostgreSQL, typed API, testing, and plugin path before expanding sideways.

### 2. Common Business Workflows Over General-purpose Flexibility

We choose database-driven business application workflows over maximum general-purpose flexibility.

This means admin, internal tool, SaaS dashboard, BFF/API, and workflow use cases should carry more weight than niche or speculative cases.

### 3. Convention Over Configuration

We choose a strong default path over a growing set of switches, options, and alternate workflows.

This means convenience for niche preferences does not usually justify new framework-level configuration.

### 4. Full-stack Slices Over Isolated Utilities

We choose features that help users build complete UI, API, database, and test slices over isolated helpers that do not connect to the main path.

This means proposals should show how they improve an actual business application workflow, not only a standalone abstraction.

### 5. Type Safety Across Boundaries

We choose APIs, schemas, database types, and React client patterns that keep data contracts clear across system boundaries.

This means proposals that weaken type inference, widen result shapes unnecessarily, or hide contracts behind implicit behavior should be treated with skepticism.

### 6. Agent-readable Structure Over Generator-heavy Workflow

We choose stable conventions, templates, examples, and best-practice guides that AI coding agents can follow directly over a large generator surface area.

This means repetitive application code is acceptable when it is clear, typed, reviewable, and easy for agents to create and modify.

### 7. Replaceable Defaults, Not Equal Alternatives

We choose replaceable defaults over equal official support for every alternative.

This means alternative stacks can be possible without becoming documentation, template, and maintainer obligations.

### 8. Intentional Dependencies Over Minimalism For Its Own Sake

We choose intentional dependencies that strengthen the curated path over minimalism as a standalone goal.

This means a dependency can be a good fit when it completes a common business workflow, reduces repeated application scaffolding, improves type safety, or supports the official stack. It is a poor fit when it adds convenience for a niche case, broadens scope without improving the main path, or leaks optional ecosystem choices into core.

## Proposal Review Questions

Before accepting a framework proposal, ask:

1. Does it strengthen the curated path for database-driven React business applications?
2. Does it reduce architecture decisions for common business work instead of adding equivalent alternatives?
3. Does it help build or maintain a complete UI, API, database, and test slice?
4. Does it improve readability for both humans and AI coding agents?
5. Does it strengthen type safety across boundaries?
6. Does it keep business-specific concerns in plugins or app code instead of pushing them into core?
7. Does it preserve React, Ant Design, and PostgreSQL as optimized defaults without making them mandatory in core?
8. If it adds a dependency, is the long-term product value for the curated path clearly worth it?
9. Does it avoid hidden magic, surprising defaults, and implicit coupling?
10. Who pays the complexity cost if this is accepted: core maintainers, docs, templates, users, or agents?

If a proposal scores poorly on the first four questions, mainly serves non-target users, spreads complexity across docs and templates, or optimizes alternative stacks at the expense of the curated path, it is usually a poor fit for FaasJS.

## Positive Signals

Changes are usually a good fit when they:

- make the curated default path more obvious
- reduce repeated scaffolding in common business product work
- create or improve complete application slices
- strengthen types and explicit contracts
- remove ambiguity or hidden behavior
- improve consistency across docs, templates, examples, and code generation
- keep business-specific concerns in plugins or app code
- keep optional ecosystem choices optional

## Likely Rejections

Proposals are usually a poor fit when they:

- add official support for more frontend frameworks
- introduce configuration mainly to avoid choosing a default path
- add abstractions mainly for rare edge cases or speculative future needs
- add generator-heavy workflows where clear conventions and examples would work better
- introduce dependencies mainly for convenience rather than curated-path value
- make core APIs depend on `@faasjs/ant-design`, `@faasjs/pg`, auth, or another ecosystem choice being present everywhere
- expand scope mainly to satisfy users who want maximum stack variety
- turn replacement paths into parallel first-class documentation and template obligations

## Common Misreads To Avoid

- FaasJS should gradually support more frontend frameworks.
- FaasJS should become highly configurable to fit more coding styles.
- Rails-inspired means FaasJS should recreate Rails generators.
- Curated means every common feature should be built into core.
- Official ecosystem recommendations should become hard core requirements.
- Wider scope is automatically a better roadmap.
- Minimal dependency count is more important than a coherent default product path.
- Agent-readable means optimizing for AI hype rather than maintainable engineering.
- A supported product type should automatically reshape the framework around its special needs.
