/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { FormElements } from '../elements'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'

describe('FormElements', () => {
  it('renders label element correctly', () => {
    render(
      <FormElements.label
        name='testName'
        label={{ title: 'Test Label', description: 'Test Description' }}
        input={{
          Input: () => <input />,
        }}
      />
    )

    expect(
      screen.getByText(content => content.includes('Test Label'))
    ).not.toBeNull()
    expect(
      screen.getByText(content => content.includes('Test Description'))
    ).not.toBeNull()
  })

  it('renders input element correctly', async () => {
    function Test() {
      const [value, setValue] = useState('value')

      return (
        <FormElements.input
          name='testInput'
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      )
    }
    render(<Test />)

    const inputElement = screen.getByRole('textbox')

    expect(inputElement).not.toBeNull()
    expect(inputElement.getAttribute('name')).toEqual('testInput')
    expect(inputElement.getAttribute('value')).toEqual('value')

    await userEvent.type(inputElement, ' new')

    expect(inputElement.getAttribute('value')).toEqual('value new')
  })

  it('renders select element with options correctly', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]
    render(
      <FormElements.select
        name='testSelect'
        value='1'
        onChange={() => 1}
        options={options}
      />
    )
    const selectElement = screen.getByRole('combobox')

    expect(selectElement).not.toBeNull()
    expect(selectElement.getAttribute('name')).toEqual('testSelect')

    for (const option of options) {
      expect(screen.getByText(option.label)).not.toBeNull()
    }
  })
})
