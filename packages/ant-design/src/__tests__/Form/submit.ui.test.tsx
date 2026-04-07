import { setMock } from '@faasjs/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Form } from '../../Form'

describe('Form/submit', () => {
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

  it('when use faas', async () => {
    let values: any
    let successValues: any
    let finished = false

    setMock(async (_, params) => {
      values = params
      return { data: 'result' }
    })

    render(
      <Form
        initialValues={{ id: 'initialValues' }}
        items={[{ id: 'id' }]}
        faas={{
          action: 'test',
          params: { params: 'params' },
          onSuccess: (_, payload) => {
            successValues = payload
          },
          onFinally: () => {
            finished = true
          },
        }}
      />,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({
      id: 'initialValues',
      params: 'params',
    })
    expect(successValues).toEqual({
      id: 'initialValues',
      params: 'params',
    })
    expect(finished).toBe(true)
  })

  it('when faas transformValues and params callback', async () => {
    let values: any
    let successValues: any

    setMock(async (_, params) => {
      values = params
      return
    })

    render(
      <Form
        initialValues={{ id: 'initialValues' }}
        items={[{ id: 'id' }]}
        faas={{
          action: 'test',
          transformValues: async (values) => ({
            ...values,
            extraProps: 'extra',
          }),
          params: (values) => ({
            params: values.extraProps,
          }),
          onSuccess: (_, payload) => {
            successValues = payload
          },
        }}
      />,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({
      id: 'initialValues',
      extraProps: 'extra',
      params: 'extra',
    })
    expect(successValues).toEqual({
      id: 'initialValues',
      extraProps: 'extra',
      params: 'extra',
    })
  })

  it('when use onFinish', async () => {
    let values: any

    render(
      <Form
        initialValues={{ id: 'initialValues' }}
        items={[{ id: 'id' }]}
        onFinish={async (nextValues: any) => {
          values = nextValues
        }}
      />,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(values).toEqual({
      id: 'initialValues',
    })
  })
})
