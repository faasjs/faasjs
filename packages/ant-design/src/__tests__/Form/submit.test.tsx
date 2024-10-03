/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'
import { setMock, Response } from '@faasjs/browser'

describe('Form/submit', () => {
  beforeEach(() => {
    setMock(null)
  })

  it('should work as default', () => {
    render(<Form />)

    expect(screen.getByRole('button')).not.toBeNull()
  })

  it('when custom submit text', () => {
    render(<Form submit={{ text: 'Save' }} />)

    expect(screen.getByText('Save')).not.toBeNull()
  })

  it('when submit is false', () => {
    render(<Form submit={false} />)

    expect(screen.queryByText('Submit')).toBeNull()
  })

  it('when submit to without onFinish', async () => {
    let values: any

    setMock(async (_, params) => {
      values = params
      return new Response({
        status: 201,
      })
    })

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

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({
      id: 'initialValues',
      params: 'params',
    })
  })

  it('when submit to with onFinish', async () => {
    let values: any

    setMock(async (_, params) => {
      values = params
      return new Response({
        status: 201,
      })
    })

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

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({
      id: 'initialValues',
      params: 'params',
      extraProps: 'extra',
    })
  })

  it('when submit to server function', async () => {
    let values: any

    render(<Form submit={{ to: { action: (params) => values = params } }} />)

    screen.debug()

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({})
  })
})
