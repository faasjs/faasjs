/**
 * @jest-environment @happy-dom/jest-environment
 */

import { fireEvent, render, screen } from '@testing-library/react'
import { FormContextProvider } from '../../context'
import { FormLabelElement, type FormLabelElementProps } from '../Label'

const renderWithContext = (
  ui: React.ReactElement,
  { values = {}, setValues = jest.fn(), error = undefined } = {}
) =>
  render(
    <FormContextProvider value={{
      values, setValues, errors: {
        testName: error,
      }
    } as any}>
      {ui}
    </FormContextProvider>
  )

describe('FormLabelElement', () => {
  const defaultProps: FormLabelElementProps = {
    name: 'testName',
    title: 'Test Label',
    description: 'Test Description',
  }

  it('should render without title and description', () => {
    renderWithContext(<FormLabelElement name='testName' />)

    expect(screen.getByText(c => c.includes('testName'))).not.toBeNull()
  })

  it('should render label title and description', () => {
    renderWithContext(<FormLabelElement {...defaultProps} />)

    expect(screen.getByText(c => c.includes('Test Label'))).not.toBeNull()
    expect(screen.getByText(c => c.includes('Test Description'))).not.toBeNull()
  })

  it('should render input element with correct value', () => {
    const values = { testName: 'testValue' }
    renderWithContext(<FormLabelElement {...defaultProps} />, { values })

    expect(screen.getByDisplayValue('testValue')).not.toBeNull()
  })

  it('should call setValues on input change', () => {
    let values = { testName: '' }
    const setValues = jest.fn().mockImplementation(fn => (values = fn(values)))
    renderWithContext(<FormLabelElement {...defaultProps} />, { setValues })

    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: 'newValue' },
    })

    expect(values).toEqual({ testName: 'newValue' })
  })

  it('should render custom input component if provided', () => {
    const CustomInput = ({ name, value, onChange }: any) => (
      <input
        data-testid='custom-input'
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )
    const customProps: FormLabelElementProps = {
      ...defaultProps,
      input: {
        Input: CustomInput,
      },
    }
    let values = { testName: 'testValue' }
    const setValues = jest.fn().mockImplementation(fn => (values = fn(values)))
    renderWithContext(<FormLabelElement {...customProps} />, {
      values,
      setValues,
    })

    expect(screen.getByTestId('custom-input')).not.toBeNull()
    expect(
      (screen.getByTestId('custom-input') as HTMLInputElement).value
    ).toEqual('testValue')

    fireEvent.change(screen.getByTestId('custom-input'), {
      target: { value: 'newValue' },
    })

    expect(values).toEqual({ testName: 'newValue' })
  })

  it('should render error message', () => {
    const error = { message: 'Test Error' }
    renderWithContext(<FormLabelElement {...defaultProps} />, { error })

    expect(screen.getByText(c => c.includes('Test Error'))).not.toBeNull()
  })
})
