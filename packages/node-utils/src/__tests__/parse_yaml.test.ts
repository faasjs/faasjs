import { describe, expect, it } from 'vitest'
import { parseYaml } from '../parse_yaml'

describe('parseYaml', () => {
  it('should parse mapping, scalars and comments', () => {
    const result = parseYaml(`defaults:
  server:
    root: .
    base: /api # inline comment
  plugins:
    http:
      secure: false
      retries: 3
      ratio: 1.5
      message: "hello # world"
  empty: null
local:
`) as Record<string, any>

    expect(result.defaults.server).toEqual({
      root: '.',
      base: '/api',
    })
    expect(result.defaults.plugins.http).toEqual({
      secure: false,
      retries: 3,
      ratio: 1.5,
      message: 'hello # world',
    })
    expect(result.defaults.empty).toBeNull()
    expect(result.local).toBeNull()
  })

  it('should parse sequence with scalar and mapping items', () => {
    const result = parseYaml(`defaults:
  tags:
    - alpha
    - 'beta'
  hooks:
    - name: before
      enabled: true
    - name: after
      retries: 2
`) as Record<string, any>

    expect(result.defaults.tags).toEqual(['alpha', 'beta'])
    expect(result.defaults.hooks).toEqual([
      {
        name: 'before',
        enabled: true,
      },
      {
        name: 'after',
        retries: 2,
      },
    ])
  })

  it('should resolve anchors and aliases', () => {
    const result = parseYaml(`defaults: &defaults
  server:
    base: /api
local:
  <<: *defaults
  server:
    root: app
shared:
  - &hook
    name: before
    enabled: true
  - *hook
`) as Record<string, any>

    expect(result.local).toEqual({
      server: {
        root: 'app',
      },
    })
    expect(result.shared).toEqual([
      {
        name: 'before',
        enabled: true,
      },
      {
        name: 'before',
        enabled: true,
      },
    ])
  })

  it('should merge mapping from sequence aliases', () => {
    const result = parseYaml(`base1: &base1
  host: localhost
base2: &base2
  port: 5432
target:
  <<:
    - *base1
    - *base2
  db: test
`) as Record<string, any>

    expect(result.target).toEqual({
      host: 'localhost',
      port: 5432,
      db: 'test',
    })
  })

  it('should return undefined for empty content', () => {
    expect(parseYaml('\n# comment\n')).toBeUndefined()
  })

  it('should throw for unsupported block scalar', () => {
    expect(() =>
      parseYaml(`defaults:
  message: |
    hello
`),
    ).toThrow('Block scalar is not supported')
  })

  it('should throw for unknown alias', () => {
    expect(() => parseYaml('defaults: *missing\n')).toThrow('Unknown alias "*missing"')
  })

  it('should throw when merge key source is invalid', () => {
    expect(() =>
      parseYaml(`target:
  <<: hello
`),
    ).toThrow('Merge key "<<" expects a mapping or sequence of mappings')
  })

  it('should throw for tab indentation', () => {
    expect(() => parseYaml('\tdefaults:\n')).toThrow('Tabs are not supported for indentation')
  })
})
