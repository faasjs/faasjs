---
name: faasjs-specs
description: 'Use when implementing, reviewing, or verifying normative FaasJS runtime behavior and compatibility for faas.yaml, staged config discovery and merge order, zero-mapping route resolution, HTTP request/response protocol envelopes, status behavior, plugin identity, lifecycle execution, config layering, and config-driven plugin loading.'
---

# FaasJS Specifications

## Default Workflow

1. Load the relevant spec before changing runtime behavior or public documentation.
2. Treat MUST/SHOULD/MAY language as normative.
3. Keep implementation, docs, and tests aligned with the spec.
4. Preserve backwards compatibility unless the change is intentionally breaking and documented.

## Load These References

- `faas.yaml` placement, discovery, merge order, staging keys, server node, plugins node, and YAML subset: `references/specs/faas-yaml.md`.
- Zero-mapping file naming and route lookup order: `references/specs/routing-mapping.md`.
- HTTP request, response envelope, status, and transport behavior: `references/specs/http-protocol.md`.
- Plugin identity, lifecycle execution, config layering, manual registration, and config-driven loading: `references/specs/plugin.md`.

## Gotchas

- Specs are normative and may be stricter than general guides.
- Route behavior and config merge order are compatibility-sensitive.
- HTTP response behavior must preserve envelope and low-level error distinctions.
- Plugin config precedence must stay aligned with both manual and config-driven loading.

## Validation

- Run targeted runtime tests for the spec area changed.
- Run `npm run doc` after spec source edits.
- Run `cd docs && npm run build` when docs routing, spec pages, or links change.
