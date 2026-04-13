import { describe, expect, it, vi } from 'vitest'

vi.mock('virtual:faasjs-pages', () => ({
  pageModules: {},
}))

import * as routing from '../routing'
import { bootstrap as bootstrapRouting } from '../routing_client'
import { bootstrap as bootstrapAutoPages } from '../routing_client_legacy'
import * as autoPages from '../routing_legacy'

describe('routing aliases', () => {
  it('re-exports the page resolution helpers', () => {
    expect(routing.resolvePageModule).toBe(autoPages.resolvePageModule)
    expect(routing.resolvePageQuery).toBe(autoPages.resolvePageQuery)
  })

  it('re-exports the client bootstrap entrypoint', () => {
    expect(bootstrapRouting).toBe(bootstrapAutoPages)
  })
})
