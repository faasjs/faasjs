/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Input } from 'antd'
import { Form, FormProps, ExtendFormItemProps } from '../../Form'

type ExtendTypes = ExtendFormItemProps & {
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
        ]}
      />
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(
      container.querySelector('input[type="password"]')
    ).toBeInTheDocument()
  })
})
