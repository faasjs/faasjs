# FaasJS Specifications

This folder stores internal, normative specifications for FaasJS.

## Scope

- Internal source of truth for framework-level contracts.
- Version 1 is repository-internal only and is not published to faasjs.com yet.
- Legacy docs remain unchanged during this phase.

## Language and File Naming

- English is the default source file: `*.md`.
- Chinese mirror uses `.zh.md`: `*.zh.md`.
- Each English spec MUST have a matching Chinese file with the same basename.

## Normative Keywords

The keywords `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` are used as defined in RFC 2119.

## Status

- `Draft`: under discussion and can change.
- `Accepted`: approved and used as current contract.
- `Deprecated`: superseded but kept for compatibility/history.

## Spec Index

| Spec             | Status   | Version | English                                    | Chinese                                          |
| ---------------- | -------- | ------- | ------------------------------------------ | ------------------------------------------------ |
| faas.yaml Config | Accepted | v1.0    | [faas-yaml.md](./faas-yaml.md)             | [faas-yaml.zh.md](./faas-yaml.zh.md)             |
| HTTP Protocol    | Accepted | v1.0    | [http-protocol.md](./http-protocol.md)     | [http-protocol.zh.md](./http-protocol.zh.md)     |
| Routing Mapping  | Accepted | v1.0    | [routing-mapping.md](./routing-mapping.md) | [routing-mapping.zh.md](./routing-mapping.zh.md) |

## Authoring Workflow

1. Start from [\_template.md](./_template.md) and [\_template.zh.md](./_template.zh.md).
2. Write/update English first, then update Chinese mirror.
3. Keep examples and rule numbers aligned across languages.
4. Update `Status`, `Version`, and `Last Updated` on every meaningful change.
