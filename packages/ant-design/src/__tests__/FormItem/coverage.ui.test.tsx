import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let renderedFormItems: any[]
let lastFormListProps: any
let lastSelectProps: any
const listState: {
  fields: any[]
  add: ReturnType<typeof vi.fn>
  remove: ReturnType<typeof vi.fn>
  errors: any[]
} = {
  fields: [],
  add: vi.fn(),
  remove: vi.fn(),
  errors: [],
}

vi.mock('antd', async () => {
  const React = await import('react')

  function FormItemComponent(props: any) {
    renderedFormItems.push(props)

    return React.createElement('div', { 'data-testid': 'form-item' }, props.children)
  }

  FormItemComponent.useStatus = vi.fn()

  return {
    Button(props: any) {
      return React.createElement(
        'button',
        {
          type: 'button',
          onClick: props.onClick,
        },
        props.children,
      )
    },
    Col(props: any) {
      return React.createElement('div', { 'data-testid': 'col' }, props.children)
    },
    DatePicker(props: any) {
      return React.createElement('div', {
        'data-testid': props.showTime ? 'time-picker' : 'date-picker',
      })
    },
    Form: {
      Item: FormItemComponent,
      List(props: any) {
        lastFormListProps = props

        return React.createElement(
          'div',
          { 'data-testid': 'form-list' },
          props.children(
            listState.fields,
            {
              add: listState.add,
              remove: listState.remove,
            },
            {
              errors: listState.errors,
            },
          ),
        )
      },
      ErrorList(props: any) {
        return React.createElement('div', { 'data-testid': 'error-list' }, props.errors?.join(','))
      },
    },
    Input(props: any) {
      return React.createElement('input', {
        type: props.type || 'text',
        hidden: props.hidden,
        'data-testid': props.type === 'hidden' ? 'hidden-input' : 'input',
      })
    },
    InputNumber() {
      return React.createElement('input', { 'data-testid': 'input-number' })
    },
    Radio: {
      Group(props: any) {
        return React.createElement('div', { 'data-testid': 'radio-group' }, props.children)
      },
    },
    Row(props: any) {
      return React.createElement('div', { 'data-testid': 'row' }, props.children)
    },
    Select(props: any) {
      lastSelectProps = props

      return React.createElement('div', {
        'data-testid': 'select',
        'data-mode': props.mode || 'single',
      })
    },
    Switch() {
      return React.createElement('input', { type: 'checkbox', 'data-testid': 'switch' })
    },
  }
})

import { FormItem } from '../../FormItem'

describe('FormItem/coverage', () => {
  beforeEach(() => {
    renderedFormItems = []
    lastFormListProps = undefined
    lastSelectProps = undefined
    listState.fields = []
    listState.errors = []
    listState.add.mockReset()
    listState.remove.mockReset()
  })

  it('should build scalar required rules with the default string input', async () => {
    render(<FormItem id="name" required />)

    await waitFor(() => {
      expect(renderedFormItems.length).toBeGreaterThan(0)
    })

    expect(renderedFormItems.at(-1).rules[0].message).toBe('Name is required')
    expect(screen.getByTestId('input')).toBeDefined()
  })

  it('should build array validators and list extras', async () => {
    listState.fields = [{ key: 0, name: 0 }]

    render(<FormItem id="tags" type="string[]" required extra="Hint" />)

    await waitFor(() => {
      expect(lastFormListProps?.rules?.length).toBeGreaterThan(0)
    })

    await expect(lastFormListProps.rules[0].validator({}, [])).rejects.toThrow('Tags is required')
    await expect(lastFormListProps.rules[0].validator({}, ['a'])).resolves.toBeUndefined()

    expect(screen.getByText('Tags')).toBeDefined()
    expect(screen.getByText('Hint')).toBeDefined()
    expect(document.querySelector('.ant-form-item-required')).not.toBeNull()
  })

  it('should use select inputs for large string and number option sets', async () => {
    const { rerender } = render(
      <FormItem
        id="status"
        type="string"
        options={Array.from({ length: 11 }, (_, index) => `opt-${index}`)}
      />,
    )

    await waitFor(() => {
      expect(lastSelectProps).toBeDefined()
    })
    expect(screen.getByTestId('select')).toBeDefined()
    expect(lastSelectProps.options).toHaveLength(11)

    rerender(
      <FormItem
        id="count"
        type="number"
        options={Array.from({ length: 11 }, (_, index) => index)}
      />,
    )

    await waitFor(() => {
      expect(lastSelectProps?.options).toHaveLength(11)
    })
  })

  it('should return null for null union children and render custom content', async () => {
    const hidden = render(<FormItem id="skip" children={null} />)

    await waitFor(() => {
      expect(hidden.container.innerHTML).toBe('')
    })

    render(<FormItem id="custom" render={() => <span>custom-render</span>} />)

    expect(await screen.findByText('custom-render')).toBeDefined()
  })

  it('should update hidden state for boolean and function shouldUpdate handlers', async () => {
    const booleanView = render(
      <FormItem id="secret" if={(values) => !!values.visible} shouldUpdate={true} />,
    )

    await waitFor(() => {
      expect(renderedFormItems.at(-1)?.shouldUpdate).toBeTypeOf('function')
    })

    await act(async () => {
      expect(renderedFormItems.at(-1).shouldUpdate({}, { visible: false })).toBe(true)
    })

    await waitFor(() => {
      expect(screen.getByTestId('hidden-input')).toBeDefined()
    })

    booleanView.unmount()
    renderedFormItems = []

    const originShouldUpdate = vi.fn(() => false)

    render(
      <FormItem id="secret" if={(values) => !!values.visible} shouldUpdate={originShouldUpdate} />,
    )

    await waitFor(() => {
      expect(renderedFormItems.at(-1)?.shouldUpdate).toBeTypeOf('function')
    })

    await act(async () => {
      expect(renderedFormItems.at(-1).shouldUpdate({ visible: false }, { visible: true })).toBe(
        true,
      )
    })

    expect(originShouldUpdate).toHaveBeenCalledWith({ visible: false }, { visible: true }, {})
  })

  it('should render object labels and object array controls', async () => {
    const { rerender } = render(
      <FormItem id="profile" type="object" label="Profile" required object={[]} />,
    )

    expect(await screen.findByText('Profile')).toBeDefined()
    expect(document.querySelector('.ant-form-item-required')).not.toBeNull()

    listState.fields = [{ key: 1, name: 0 }]

    rerender(
      <FormItem
        id="addresses"
        type="object[]"
        label="Addresses"
        extra="More addresses"
        maxCount={2}
        object={[{ id: 'line1' }]}
      />,
    )

    expect(await screen.findByText('Addresses 1')).toBeDefined()
    expect(screen.getByText('Delete')).toBeDefined()
    expect(screen.getByText('Add Addresses')).toBeDefined()
    expect(screen.getByText('More addresses')).toBeDefined()
  })
})
