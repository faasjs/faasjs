/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { Table } from '../../Table'

describe('Table/faas', () => {
  let originalFetch: any

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = jest.fn(
      async () =>
        ({
          status: 200,
          headers: new Map([['Content-Type', 'application/json']]),
          text: async () => Promise.resolve('{"data":[{"test":"value"}]}'),
        }) as unknown as Promise<Response>
    )
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
    expect(await screen.findByText('value')).toBeDefined()
  })
})
