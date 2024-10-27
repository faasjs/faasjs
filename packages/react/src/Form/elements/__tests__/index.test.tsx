/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { FormDefaultElements } from '..'
import { FormContextProvider } from '../../context'

describe('FormElements', () => {
  it('should render default elements', () => {
    render(
      <FormContextProvider value={{ values: {}, setValues: jest.fn() } as any}>
        <FormDefaultElements.Label name='testName' title='Test Label' description='Test Description' />
        <FormDefaultElements.Input name='testName' value='testValue' onChange={jest.fn()} />
        <FormDefaultElements.Button>Click Me</FormDefaultElements.Button>
      </FormContextProvider>
    )

    expect(screen.getByText(c => c.includes('Test Label'))).not.toBeNull()
    expect(screen.getByText(c => c.includes('Test Description'))).not.toBeNull()
    expect(screen.getByDisplayValue('testValue')).not.toBeNull()
    expect(screen.getByText('Click Me')).not.toBeNull()
  })
})
