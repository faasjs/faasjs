import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormLabelElement, type FormLabelElementProps } from '../Label'

describe('FormLabelElement', () => {
  const defaultProps: FormLabelElementProps = {
    name: 'testName',
    title: 'Test Label',
    description: 'Test Description',
    children: null,
  }

  it('should render without title and description', () => {
    render(<FormLabelElement name='testName'>{null}</FormLabelElement>)

    expect(screen.getByText(c => c.includes('testName'))).not.toBeNull()
  })

  it('should render label title and description', () => {
    render(<FormLabelElement {...defaultProps} />)

    expect(screen.getByText(c => c.includes('Test Label'))).not.toBeNull()
    expect(screen.getByText(c => c.includes('Test Description'))).not.toBeNull()
  })

  it('should render input element with correct value', () => {
    render(
      <FormLabelElement {...defaultProps}>
        <input title='test' value='testValue' />
      </FormLabelElement>
    )

    expect(screen.getByDisplayValue('testValue')).not.toBeNull()
  })

  it('should render error message', () => {
    render(<FormLabelElement {...defaultProps} error={Error('Test Error')} />)

    expect(screen.getByText(c => c.includes('Test Error'))).not.toBeNull()
  })
})
