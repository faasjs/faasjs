**@faasjs/pg-dev**

# @faasjs/pg-dev

# @faasjs/pg-dev

The published surface exposes `PgVitestPlugin` plus the low-level setup helper used by the
generated Vitest setup module. The plugin is the normal entrypoint for applications;
`setupPgVitest` is exported so generated or custom Vitest setup files can wire the same
lazy database lifecycle manually.

## Functions

- [PgVitestPlugin](functions/PgVitestPlugin.md)
- [setupPgVitest](functions/setupPgVitest.md)

## Interfaces

- [PgVitestSetupRuntime](interfaces/PgVitestSetupRuntime.md)
