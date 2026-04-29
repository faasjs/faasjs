import { describe, expect, it } from 'vitest'

import * as Pg from '../../index'

describe('Pg', () => {
  it('should be defined', () => {
    expect(Object.keys(Pg)).toEqual([
      'Migrator',
      'registerDatabaseBootstrap',
      'resolveDatabaseBootstrap',
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
