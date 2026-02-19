import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ComponentType } from 'react'
import { assertType, describe, expect, it, vi } from 'vitest'
import { FormContainer, type FormProps } from '../Container'
import type {
  FormButtonElementProps,
  FormInputElementProps,
  FormLabelElementProps,
} from '../elements'

describe('FormContainer', () => {
  const defaultProps = {
    items: [{ name: 'test' }],
    onSubmit: vi.fn(),
  }

  it('should render FormBody', () => {
    render(<FormContainer {...defaultProps} />)
    expect(screen.getByText('test')).not.toBeNull()
  })

  it('should call onSubmit with correct values', async () => {
    const onSubmit = vi.fn().mockResolvedValueOnce(Promise.resolve())
    render(<FormContainer {...defaultProps} onSubmit={onSubmit} />)

    await act(async () => fireEvent.click(screen.getByRole('button')))

    expect(onSubmit).toHaveBeenCalledWith({ test: '' })
  })

  it('should merge default values correctly', () => {
    const defaultValues = { test: 'default' }

    render(<FormContainer {...defaultProps} defaultValues={defaultValues} />)

    expect(screen.getByDisplayValue('default')).not.toBeNull()
  })

  it('should support custom input props', () => {
    type CustomInputProps = FormInputElementProps & {
      custom?: boolean
    }

    assertType<
      ComponentType<
        FormProps<
          { key: string },
          {
            Input: ComponentType<CustomInputProps>
            Label: ComponentType<FormLabelElementProps>
            Button: ComponentType<FormButtonElementProps>
          }
        >
      >
    >(
      FormContainer<
        { key: string },
        {
          Input: ComponentType<CustomInputProps>
          Label: ComponentType<FormLabelElementProps>
          Button: ComponentType<FormButtonElementProps>
        }
      >,
    )

    const props: FormProps<
      { key: string },
      {
        Input: ComponentType<CustomInputProps>
        Label: ComponentType<FormLabelElementProps>
        Button: ComponentType<FormButtonElementProps>
      }
    > = {
      items: [
        {
          name: 'test',
          input: {
            props: {
              custom: true,
            },
          },
        },
      ],
    }

    assertType<{ key: string }>(props.defaultValues!)

    assertType<{ custom?: boolean }>(props.items[0]!.input!.props!)
  })

  it('should work with rules', async () => {
    render(<FormContainer items={[{ name: 'test', rules: { required: true } }]} />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(screen.getByText('This field is required')).not.toBeNull()
  })
})
