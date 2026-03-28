# faas.yaml Configuration Specification

## Background

`faas.yaml` is the runtime configuration entry used by FaasJS config loading, local dev server resolution, and type generation.

This spec defines the internal baseline that matches current behavior.

Related references:

- `packages/node-utils/src/load_config.ts`
- `packages/node-utils/src/parse_yaml.ts`
- `packages/dev/src/server_config.ts`
- `packages/dev/src/typegen.ts`

## Goals

- Keep config discovery and merge order deterministic.
- Keep staging-level validation predictable.
- Define the supported YAML subset explicitly.

## Normative Rules

### 1. File naming and placement

1. Configuration file name MUST be `faas.yaml`.
2. Project-level configuration SHOULD be placed at `<projectRoot>/src/faas.yaml`.
3. Additional `faas.yaml` files MAY be placed in nested directories under `src/` for local overrides.

### 2. Discovery and merge order

1. For a function file under `<srcRoot>/<path>/<file>.func.ts`, the loader MUST discover files from shallow to deep:
   - `<srcRoot>/faas.yaml`
   - `<srcRoot>/<path-segment-1>/faas.yaml`
   - ...
   - `<srcRoot>/<path>/faas.yaml`
2. Effective config MUST be merged in discovered order where deeper config overrides shallower config.
3. For each staging key `S != defaults`, effective staging config MUST be `deepMerge(defaults, S)` after file-level merge is done.
4. If requested staging does not exist, runtime MUST fall back to `defaults`, then to an empty object.

### 3. Root object and staging keys

1. The parsed root value MUST be an object when provided.
2. Each top-level staging value MUST be an object when provided.
3. `defaults` SHOULD exist and SHOULD contain shared baseline settings.

### 4. `server` node contract

1. `<staging>.server`, when present, MUST be an object.
2. `<staging>.server.root`, when present, MUST be a string.
3. `<staging>.server.base`, when present, MUST be a string.
4. In `@faasjs/dev`, `server.root` MUST be resolved relative to project root and represent project root.
5. In `@faasjs/dev`, source root MUST be `<server.root>/src`.
6. In type generation, output path MUST be `<server.root>/src/.faasjs/types.d.ts`.

### 5. `plugins` node authoring

1. `<staging>.plugins` MAY be omitted.
2. Recommended authoring shape is a mapping from plugin key to plugin config object.
3. Plugin key SHOULD be stable within the same staging because `loadConfig()` derives runtime `name` from that key.
4. `name` is a loader-generated runtime field and SHOULD NOT be authored manually in `faas.yaml`.
5. A plugin config object MAY contain `type`, `config`, and other plugin-specific fields.
6. Plugin-specific inner fields are outside the scope of this spec and are preserved during merge.

### 6. Supported YAML subset

1. The parser MUST support indentation-based mappings and sequences.
2. The parser MUST support plain, single-quoted, and double-quoted scalars.
3. The parser MUST support scalar values: `null`, `boolean`, `number`, and `string`.
4. The parser MUST support anchors (`&`), aliases (`*`), and merge key (`<<`) for mappings.
5. The parser MUST NOT allow tabs for indentation.
6. The parser MUST NOT allow multiple YAML documents (`---`, `...`).
7. The parser MUST NOT allow block scalars (`|`, `>`), YAML tags (`!`), or non-empty flow collections (`[a]`, `{a: 1}`).
8. Empty flow collections `[]` and `{}` MAY be used.

### 7. Error handling

1. Invalid config structure MUST throw an error prefixed with:
   - `[loadConfig] Invalid faas.yaml <filePath> at "<keyPath>": <reason>`
2. Unsupported YAML syntax/features MUST throw parse errors prefixed with:
   - `[parseYaml]`
3. Config consumers (for example dev server startup or typegen) SHOULD fail fast when config loading fails.

## Examples

```yaml
defaults:
  server:
    root: .
    base: /api
  plugins:
    http:
      type: http
      config:
        cookie:
          secure: false
```
