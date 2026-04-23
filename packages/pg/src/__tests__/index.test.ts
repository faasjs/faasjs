import { describe, expect, it } from 'vitest'

import * as TypedPg from '../index'

describe('TypedPg', () => {
  it('should be defined', () => {
    expect(Object.keys(TypedPg)).toEqual([
      'registerDatabaseBootstrap',
      'Migrator',
      'Client',
      'createClient',
      'getClient',
      'getClients',
      'QueryBuilder',
      'TableBuilder',
      'SchemaBuilder',
      'escapeIdentifier',
      'escapeValue',
      'rawSql',
      'isTemplateStringsArray',
      'createTemplateStringsArray',
    ])
  })
})
