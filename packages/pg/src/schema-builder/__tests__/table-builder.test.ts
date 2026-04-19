import { describe, expect, it } from 'vitest'

import { TableBuilder } from '../table-builder'

describe('TableBuilder', () => {
  it('supports varchar length and decimal fallback scale', () => {
    const table = new TableBuilder('users', 'create')

    table.string('name', 128)
    table.number('balance', 10)
    table.number('age')

    const sql = table.toSQL().join('\n')

    expect(sql).toContain('"name" varchar(128) NOT NULL')
    expect(sql).toContain('"balance" decimal(10,0) NOT NULL')
    expect(sql).toContain('"age" integer NOT NULL')
  })

  it('renames an existing create-mode column', () => {
    const table = new TableBuilder('users', 'create')

    table.string('name')
    table.renameColumn('name', 'display_name')

    const sql = table.toSQL().join('\n')

    expect(sql).toContain('"display_name" varchar NOT NULL')
    expect(sql).not.toContain('"name" varchar NOT NULL')
  })

  it('throws when renaming a missing create-mode column', () => {
    const table = new TableBuilder('users', 'create')

    expect(() => table.renameColumn('missing', 'display_name')).toThrowError(
      'renameColumn failed: Column "missing" does not exist',
    )
  })

  it('allows dropping columns while creating table', () => {
    const table = new TableBuilder('users', 'create')

    table.string('name')
    table.dropColumn('name')

    const sql = table.toSQL().join('\n')

    expect(sql).not.toContain('"name" varchar')
  })

  it('throws when altering a missing create-mode column', () => {
    const table = new TableBuilder('users', 'create')

    expect(() => table.alterColumn('missing', { unique: true })).toThrowError(
      'alterColumn failed: Column "missing" does not exist',
    )
  })

  it('supports nullable and references column helpers', () => {
    const table = new TableBuilder('users', 'create')

    table.string('role_id').nullable().references('roles', 'id')

    const sql = table.toSQL().join('\n')

    expect(sql).toContain('"role_id" varchar NULL REFERENCES roles(id)')
  })

  it('supports dropping existing in-memory index definitions', () => {
    const table = new TableBuilder('users', 'create')

    table.string('name')
    table.index('name')
    table.dropIndex('name')

    const sql = table.toSQL().join('\n')

    expect(sql).not.toContain('idx_users_name')
  })

  it('throws when dropping missing create-mode index', () => {
    const table = new TableBuilder('users', 'create')

    expect(() => table.dropIndex('name')).toThrowError(
      'dropIndex failed: Index "idx_users_name" does not exist',
    )
  })

  it('supports alter-mode dropIndex operations with array columns', () => {
    const table = new TableBuilder('users', 'alter')

    table.dropIndex(['first_name', 'last_name'])

    const sql = table.toSQL().join('\n')

    expect(sql).toContain('DROP INDEX IF EXISTS "idx_users_first_name_last_name";')
  })

  it('supports nullable, unique, references and collate alter operations', () => {
    const table = new TableBuilder('users', 'alter')

    table.alterColumn('email', {
      nullable: true,
      unique: false,
      references: {
        table: 'accounts',
        column: 'id',
      },
      collate: '"en_US"',
    })

    const sql = table.toSQL().join('\n')

    expect(sql).toContain('ALTER COLUMN "email" DROP NOT NULL;')
    expect(sql).toContain('DROP CONSTRAINT IF EXISTS "users_email_unique";')
    expect(sql).toContain('ALTER COLUMN "email" ADD REFERENCES accounts(id);')
    expect(sql).toContain('ALTER COLUMN "email" SET COLLATE "en_US";')
  })
})
