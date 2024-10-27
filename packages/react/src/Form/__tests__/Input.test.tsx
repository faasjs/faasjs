/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render } from '@testing-library/react'
import { FormContainer } from '../Container'

describe('FormInput', () => {
  it('renders input element and handles change', () => {
    const { getByRole } = render(
      <FormContainer
        defaultValues={{
          test: 'value',
        }}
        items={[
          {
            name: 'test',
          },
        ]}
      />
    )
    const input = getByRole('textbox')

    expect(input.getAttribute('value')).toEqual('value')
  })

  it('renders select element and handles change', () => {
    const { getByRole } = render(
      <FormContainer
        defaultValues={{
          test: 'value',
        }}
        items={[
          {
            name: 'test',
            input: {
              type: 'select',
              props: {
                options: [{ value: 'value', label: 'Label' }],
              },
            },
          },
        ]}
      />
    )

    const select = getByRole('option', { name: 'Label' }) as HTMLOptionElement

    expect(select.selected).toBeTruthy()
  })

  it('renders custom input component and handles change', () => {
    const CustomInput = ({ name, value, onChange }: any) => (
      <input
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )

    const { getByRole } = render(
      <FormContainer
        defaultValues={{
          test: 'value',
        }}
        items={[
          {
            name: 'test',
            input: {
              Input: CustomInput,
            },
          },
        ]}
      />
    )
    const input = getByRole('textbox')

    expect(input.getAttribute('value')).toEqual('value')
  })
})
