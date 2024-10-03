/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { Input } from 'antd'
import { Form, type FormProps, type ExtendFormItemProps } from '../../Form'

interface ExtendTypes extends ExtendFormItemProps {
  type: 'password'
}

describe('Form/extend', () => {
  it('children', () => {
    function ExtendForm(props: FormProps<any, ExtendTypes>) {
      return (
        <Form
          {...props}
          extendTypes={{ password: { children: <Input.Password /> } }}
        />
      )
    }

    const { container } = render(
      <ExtendForm
        items={[
          {
            id: 'test',
            type: 'password',
            required: true,
          },
          {
            id: 'default',
          },
          {
            id: 'string',
            type: 'string',
          },
        ]}
      />
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(container.querySelector('input[type="password"]')).toBeDefined()
  })
})
