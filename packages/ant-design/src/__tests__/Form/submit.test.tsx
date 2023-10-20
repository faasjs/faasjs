/**
 * @jest-environment jsdom
 */
import { FaasReactClient } from '@faasjs/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'

describe('Form/submit', () => {
  it('should work as default', () => {
    render(<Form />)

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('when custom submit text', () => {
    render(<Form submit={{ text: 'Save' }} />)

    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('when submit is false', () => {
    render(<Form submit={false} />)

    expect(screen.queryByText('Submit')).toBeNull()
  })

  it('when submit to without onFinish', async () => {
    const originalFetch = window.fetch
    let values: any
    window.fetch = jest.fn(async (_, request) => {
      values = JSON.parse(request.body as string)
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => JSON.stringify({ data: {} }),
      }) as unknown as Promise<Response>
    }) as typeof window.fetch
    FaasReactClient({ domain: 'test' })

    render(
      <Form
        initialValues={{ id: 'initialValues' }}
        items={[{ id: 'id' }]}
        submit={{
          to: {
            action: 'test',
            params: { params: 'params' },
          },
        }}
      />
    )

    await userEvent.click(screen.getByText('Submit'))

    expect(values).toEqual({
      id: 'initialValues',
      params: 'params',
    })

    window.fetch = originalFetch
  })

  it('when submit to with onFinish', async () => {
    const originalFetch = window.fetch
    let values: any
    window.fetch = jest.fn(async (_, request) => {
      values = JSON.parse(request.body as string)
      return Promise.resolve({
        status: 200,
        headers: new Map([['Content-Type', 'application/json']]),
        text: async () => JSON.stringify({ data: {} }),
      }) as unknown as Promise<Response>
    }) as typeof window.fetch
    FaasReactClient({ domain: 'test' })

    render(
      <Form
        initialValues={{ id: 'initialValues' }}
        items={[{ id: 'id' }]}
        submit={{
          to: {
            action: 'test',
            params: { params: 'params' },
          },
        }}
        onFinish={async (values, submit) => {
          await submit({
            ...values,
            extraProps: 'extra',
          })
        }}
      />
    )

    await userEvent.click(screen.getByText('Submit'))

    expect(values).toEqual({
      id: 'initialValues',
      params: 'params',
      extraProps: 'extra',
    })

    window.fetch = originalFetch
  })
})
