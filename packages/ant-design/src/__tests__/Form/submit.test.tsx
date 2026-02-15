import { setMock } from '@faasjs/browser'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { Form } from '../../Form'

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
      return
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
      return
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
          if (!submit) throw Error('submit not initialized')

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
})
