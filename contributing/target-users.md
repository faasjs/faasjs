# Target Users And Product Boundaries

Use this guide when evaluating framework changes that could affect FaasJS positioning, supported stacks, dependency policy, abstractions, or default workflows.

Its goal is to keep contributors aligned on who FaasJS is for and which tradeoffs the project should prefer.

## Positioning

FaasJS is a React-only, agent-friendly full-stack TypeScript framework.

It prioritizes:

- readability for humans and agents
- low ambiguity and stable conventions
- type safety
- minimal dependencies
- a simple core with an out-of-the-box main path

FaasJS does not aim to be a highly configurable framework or a framework that supports every frontend stack.

## Target Users

FaasJS is for developers and teams who want:

- clear conventions instead of many competing styles
- a React-only full-stack path
- code that is easy to read, review, refactor, and maintain
- a framework that works well with AI agent generation and review
- a simple setup that is still ready for common product work

FaasJS is not optimized for users who primarily want maximum configurability, many interchangeable frontend choices, or broad compatibility across multiple framework models.

## Supported Product Types

FaasJS supports multiple product types, including:

- admin panels and back-office systems
- internal tools
- BFF and API projects
- SaaS products
- AI applications
- content-driven or business websites

These categories do not have a strict official ranking.

The project goal is not to build a different framework personality for each category. The goal is to keep one simple, predictable full-stack path that works well across them.

## Official Recommended Paths

### React

FaasJS only supports React.

This is a deliberate product boundary that keeps the framework, docs, and contributor mental model simpler. Changes should not assume that support for more frontend frameworks is a default direction for the project.

### `@faasjs/ant-design`

`@faasjs/ant-design` is an important but optional official ecosystem package.

It is the recommended frontend path because it is ready out of the box for most business systems and reduces the amount of repeated UI scaffolding contributors and users need to build.

It is deeply supported, but it is still an ecosystem package rather than the definition of the entire framework.

### `@faasjs/pg`

`@faasjs/pg` is an important but optional official ecosystem package.

It is the recommended database path and the default happy path for FaasJS database work, but it should still be treated as an ecosystem choice rather than a hard definition of the framework itself.

## Design Priorities

### 1. Agent readability and low ambiguity come first

When flexibility and readability conflict, prefer readability.

When more supported patterns and clearer conventions conflict, prefer clearer conventions.

Good FaasJS design should make code easier for humans and agents to generate, review, refactor, and maintain.

### 2. Simplicity is more important than configurability

FaasJS does not pursue a highly configurable design.

Do not assume that adding options, switches, or alternate paths is automatically an improvement. In many cases it only moves complexity into docs, reviews, maintenance, and agent behavior.

### 3. Minimal dependencies are a hard constraint in most cases

New dependencies need a strong reason.

In most cases, adding a dependency is only justified when it brings clear value to the core path and that value outweighs the long-term cost in upgrades, auditing, supply-chain risk, and maintenance.

### 4. Strengthen the main path instead of expanding edge cases

Prefer changes that make the main FaasJS path clearer and more capable.

Avoid adding framework-level abstractions mainly to cover edge cases, alternate styles, or speculative future flexibility.

## Review Questions

Before accepting a framework proposal, ask:

1. Does it improve readability for both humans and agents?
2. Does it reduce ambiguity instead of introducing new implicit rules?
3. Does it strengthen the main React-only path?
4. Does it keep the framework simple instead of making it more configurable?
5. Does it avoid new dependencies unless they are clearly worth the cost?
6. Does it help common product work without turning FaasJS into a different kind of framework?

If the answer to most of these questions is no, the proposal is usually a poor fit for FaasJS.

## Common Misreads To Avoid

- FaasJS should gradually support more frontend frameworks.
- FaasJS should become highly configurable to fit more styles.
- Officially recommended ecosystem packages should become hard requirements everywhere.
- More scope or more abstraction is automatically better.
- Convenience alone is enough reason to add a dependency.
