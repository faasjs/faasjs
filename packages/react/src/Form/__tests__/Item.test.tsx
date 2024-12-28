import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { FormItem } from '../Item'
import { FormContextProvider } from '../context'
import { FormDefaultElements } from '../elements'

const renderWithContext = (
  ui: React.ReactElement,
  {
    values = {
      testName: 'testValue',
    },
    setValues = vi.fn(),
    error = undefined,
  } = {}
) =>
  render(
    <FormContextProvider
      value={
        {
          Elements: FormDefaultElements,
          values,
          setValues,
          errors: {
            testName: error,
          },
          items: [
            {
              name: 'testName',
            },
          ],
        } as any
      }
    >
      {ui}
    </FormContextProvider>
  )

describe('FormItem', () => {
  it('should render label and input with correct props', () => {
    renderWithContext(<FormItem name='testName' />)

    const label = screen.getByText(c => c.includes('testName')).closest('label')
    expect(label).not.toBeNull()

    const input = screen.getByDisplayValue('testValue')
    expect(input).not.toBeNull()
  })

  it('should call setValues on input change', () => {
    const mockSetValues = vi.fn()

    renderWithContext(<FormItem name='testName' />, {
      setValues: mockSetValues,
    })

    const input = screen.getByDisplayValue('testValue')
    fireEvent.change(input, { target: { value: 'newValue' } })

    expect(mockSetValues).toHaveBeenCalledWith(expect.any(Function))
    expect(mockSetValues.mock.calls[0][0]({ testName: 'testValue' })).toEqual({
      testName: 'newValue',
    })
  })
})
