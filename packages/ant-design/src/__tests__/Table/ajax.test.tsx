import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Table } from '../../Table'

describe('Table/ajax', () => {
  let originalFetch: any
  let current = 0

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = vi.fn(async () => {
      current++
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () =>
          JSON.stringify({
            data: {
              rows: [{ test: `value${current}` }],
              pagination: {
                current,
                pageSize: 10,
                total: 20,
              },
            },
          }),
      }) as unknown as Promise<Response>
    })
  })

  afterEach(() => {
    window.fetch = originalFetch
  })

  it('with faas', async () => {
    render(
      <Table
        rowKey='test'
        items={[{ id: 'test' }]}
        faasData={{ action: 'test' }}
      />
    )

    expect(await screen.findByText('Test')).toBeDefined()
    expect(await screen.findByText('value1')).toBeDefined()

    await userEvent.click(screen.getAllByRole('button')[2])

    expect(await screen.findByText('value2')).toBeDefined()
  })
})
