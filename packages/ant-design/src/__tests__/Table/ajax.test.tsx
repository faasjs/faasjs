/**
 * @jest-environment jsdom
 */
import { FaasReactClient } from '@faasjs/react'
import { render, screen } from '@testing-library/react'
import { Table } from '../../Table'
import userEvent from '@testing-library/user-event'

describe('Table/ajax', () => {
  let originalFetch: any
  let current = 0

  beforeEach(() => {
    originalFetch = window.fetch
    window.fetch = jest.fn(async () => {
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
    FaasReactClient({ domain: 'test' })
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

    expect(await screen.findByText('Test')).toBeInTheDocument()
    expect(await screen.findByText('value1')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button')[2])

    expect(await screen.findByText('value2')).toBeInTheDocument()
  })
})
