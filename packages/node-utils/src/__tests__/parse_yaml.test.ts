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

  it('should parse escaped values and keep # inside quoted strings', () => {
    const result = parseYaml(`value: "a\\n # kept" # outer
single: 'it''s # kept' # outer
`) as Record<string, any>

    expect(result.value).toBe(`a
 # kept`)
    expect(result.single).toBe("it's # kept")
  })

  it('should parse quoted mapping keys', () => {
    const result = parseYaml(`'a:b': value
`) as Record<string, any>

    expect(result['a:b']).toBe('value')
  })

  it('should parse empty collection shortcuts', () => {
    const result = parseYaml(`emptyArray: []
emptyObject: {}
`) as Record<string, any>

    expect(result.emptyArray).toEqual([])
    expect(result.emptyObject).toEqual({})
  })

  it('should parse supported double-quoted escape sequences', () => {
    const result = parseYaml(`value: "\\\"\\\\\\/\\b\\f\\n\\r\\t\\u0041"
`) as Record<string, any>

    expect(result.value).toBe('"\\/\b\f\n\r\tA')
  })

  it('should throw for invalid quoted strings', () => {
    expect(() =>
      parseYaml(`value: "abc"rest
`),
    ).toThrow('Invalid double quoted string')

    expect(() =>
      parseYaml(`value: 'abc'rest
`),
    ).toThrow('Invalid single quoted string')

    expect(() =>
      parseYaml(`value: "abc
`),
    ).toThrow('Unterminated double quoted string')

    expect(() =>
      parseYaml(`value: 'abc
`),
    ).toThrow('Unterminated single quoted string')
  })

  it('should throw for unsupported or invalid scalar syntax', () => {
    expect(() =>
      parseYaml(`value: !tag hello
`),
    ).toThrow('YAML tags are not supported')

    expect(() =>
      parseYaml(`value: [1, 2]
`),
    ).toThrow('Flow collection is not supported')

    expect(() =>
      parseYaml(`value: {a: 1}
`),
    ).toThrow('Flow collection is not supported')

    expect(() =>
      parseYaml(`value: "\\x"
`),
    ).toThrow('Unsupported escape sequence')

    expect(() =>
      parseYaml(`value: "\\u12G4"
`),
    ).toThrow('Invalid unicode escape sequence')
  })

  it('should throw for invalid keys and sequence syntax', () => {
    expect(() =>
      parseYaml(`[a]: 1
`),
    ).toThrow('Complex mapping key is not supported')

    expect(() =>
      parseYaml(`-item
`),
    ).toThrow('Invalid mapping entry, expected "key: value"')
  })

  it('should throw for invalid anchor and alias tokens', () => {
    expect(() =>
      parseYaml(`value: *
`),
    ).toThrow('Missing alias name')

    expect(() =>
      parseYaml(`value: &
  key: value
`),
    ).toThrow('Missing anchor name')

    expect(() =>
      parseYaml(`value: &bad,name test
`),
    ).toThrow('Invalid anchor name')

    expect(() =>
      parseYaml(`value: *bad,name
`),
    ).toThrow('Invalid alias name')

    expect(() =>
      parseYaml(`value: *base extra
`),
    ).toThrow('Unexpected token after alias')
  })

  it('should throw for YAML document separators', () => {
    expect(() => parseYaml('---\nkey: value\n')).toThrow(
      'Multiple YAML documents are not supported',
    )
    expect(() => parseYaml('...\nkey: value\n')).toThrow(
      'Multiple YAML documents are not supported',
    )
  })

  it('should throw for trailing content after root parse', () => {
    expect(() =>
      parseYaml(`  defaults:
    key: value
local: true
`),
    ).toThrow('Unexpected trailing content')
  })
})
