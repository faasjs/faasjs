import type postgres from 'postgres'
import { describe, it, expectTypeOf } from 'vitest'

import type { User } from '../../test-utils/tables'
import { Client, createClient, getClient, getClients, type ClientOptions } from '../client'
import type { ColumnName, ColumnValue, TableName, Tables, TableType } from '../types'

describe('types', () => {
  it('Tables', () => {
    expectTypeOf<Tables>().toEqualTypeOf<{
      query: User
      mutation: User
    }>()
  })

  it('TableType', () => {
    expectTypeOf<TableType<'query'>>().toEqualTypeOf<User>()
    expectTypeOf<TableType>().toEqualTypeOf<Record<string, any>>()
  })

  it('TableName', () => {
    expectTypeOf<TableName>().toEqualTypeOf<'query' | 'mutation'>()
  })

  it('ColumnName', () => {
    expectTypeOf<ColumnName<'query'>>().toEqualTypeOf<'id' | 'name' | 'metadata'>()
    expectTypeOf<ColumnName>().toEqualTypeOf<string>()
  })

  it('ColumnValue', () => {
    expectTypeOf<ColumnValue<'query', 'id'>>().toEqualTypeOf<number>()
    expectTypeOf<ColumnValue<'query', 'name'>>().toEqualTypeOf<string>()
    expectTypeOf<ColumnValue<'query', 'metadata'>>().toEqualTypeOf<{
      age: number
      gender?: string
    }>()
    expectTypeOf<ColumnValue<'query'>>().toEqualTypeOf<any>()
    expectTypeOf<ColumnValue>().toEqualTypeOf<any>()
  })

  it('createClient', () => {
    type CreateClientFromUrl = (
      url: string,
      options?: ClientOptions<Record<string, never>>,
    ) => Client

    const createClientFromUrl: CreateClientFromUrl = createClient

    expectTypeOf(createClientFromUrl).toEqualTypeOf<CreateClientFromUrl>()
  })

  it('Client constructor', () => {
    type ClientConstructor = new (
      url: string,
      options?: ClientOptions<Record<string, never>>,
    ) => Client

    const TypedClient: ClientConstructor = Client

    expectTypeOf(TypedClient).toEqualTypeOf<ClientConstructor>()
  })

  it('ClientOptions', () => {
    expectTypeOf<ClientOptions<Record<string, never>>>().toEqualTypeOf<
      postgres.Options<Record<string, never>>
    >()

    // @ts-expect-error logger is created internally
    const options: ClientOptions<Record<string, never>> = { logger: false }

    expectTypeOf(options).toEqualTypeOf<ClientOptions<Record<string, never>>>()
  })

  it('getClient', () => {
    type GetClient = (url?: string) => Client

    const getCachedClient: GetClient = getClient

    expectTypeOf(getCachedClient).toEqualTypeOf<GetClient>()
  })

  it('getClients', () => {
    type GetClients = () => Client[]

    const getCachedClients: GetClients = getClients

    expectTypeOf(getCachedClients).toEqualTypeOf<GetClients>()
  })
})
