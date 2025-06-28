import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { FormContextProvider } from '../context'
import { FormDefaultElements } from '../elements'
import { FormInput } from '../Input'

describe('FormInput', () => {
  function Provider(props: {
    children: React.ReactElement
    values?: any
    setValues?: (values: any) => void
  }) {
    const [values, setValues] = useState(props.values || {})

    return (
      <FormContextProvider
        value={
          {
            items: [],
            Elements: FormDefaultElements,
            values,
            setValues: props.setValues || setValues,
          } as any
        }
      >
        {props.children}
      </FormContextProvider>
    )
  }

  const renderWithContext = (
    children: React.ReactElement,
    props: { values?: any; setValues?: (values: any) => void }
  ) => {
    return render(
      <Provider values={props.values} setValues={props.setValues}>
        {children}
      </Provider>
    )
  }

  it('should render input with initial value', () => {
    const { getByDisplayValue } = renderWithContext(<FormInput name='test' />, {
      values: {
        test: 'initial',
      },
    })
    expect(getByDisplayValue('initial')).not.toBeNull()
  })

  it('should call setValues on input change', () => {
    const mockSetValues = vi.fn()

    const { getByRole } = renderWithContext(<FormInput name='test' />, {
      setValues: mockSetValues,
      values: {
        test: '',
      },
    })

    fireEvent.change(getByRole('textbox'), { target: { value: 'changed' } })

    expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should call setValues on custom input change', () => {
    let values = {
      test: '',
    }

    function CustomInput({ name, value, onChange }: any) {
      return (
        <input
          title='test'
          data-testid='custom-input'
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )
    }

    const { getByRole } = renderWithContext(
      <FormInput name='test' Input={CustomInput} />,
      {
        setValues: vi.fn().mockImplementation(v => (values = v(values))),
        values,
      }
    )

    fireEvent.change(getByRole('textbox'), { target: { value: 'changed' } })

    expect(values).toEqual({ test: 'changed' })
  })

  describe('should process value according to rules', () => {
    it('default', () => {
      let values = {
        a: 1,
        test: '',
      }

      const { getByRole } = renderWithContext(<FormInput name='test' />, {
        setValues: vi.fn().mockImplementation(v => (values = v(values))),
        values,
      })

      fireEvent.change(getByRole('textbox'), { target: { value: true } })

      expect(values).toEqual({ a: 1, test: 'true' })
    })

    it('string', () => {
      let values = {}

      const { getByRole } = renderWithContext(
        <FormInput name='test' rules={{ type: 'string' }} />,
        {
          setValues: vi.fn().mockImplementation(v => (values = v({}))),
          values: {
            test: '',
          },
        }
      )

      fireEvent.change(getByRole('textbox'), { target: { value: 1 } })

      expect(values).toEqual({ test: '1' })
    })

    it('number', () => {
      let values = {}

      const { getByRole } = renderWithContext(
        <FormInput name='test' rules={{ type: 'number' }} />,
        {
          setValues: vi.fn().mockImplementation(v => (values = v({}))),
          values: {
            test: 0,
          },
        }
      )

      fireEvent.change(getByRole('textbox'), { target: { value: '123' } })

      expect(values).toEqual({ test: 123 })
    })
  })
})
