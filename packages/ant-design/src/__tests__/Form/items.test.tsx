import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from 'antd'
import { Form } from '../../Form'

describe('Form/items', () => {
  it('should work', () => {
    render(<Form items={[{ id: 'test' }]} />)

    expect(screen.getByText('Test')).not.toBeNull()
  })

  it('should work with children', async () => {
    let value: any

    render(
      <Form
        initialValues={{ list: [''] }}
        items={[{ id: 'test' }]}
        onFinish={values => (value = values as any)}
      >
        <Form.Item id='children'>
          <Input />
        </Form.Item>
        <Form.List name='list'>
          {fields =>
            fields.map(field => (
              <Form.Item id={field.key.toString()} key={field.key} {...field}>
                <Input />
              </Form.Item>
            ))
          }
        </Form.List>
      </Form>
    )

    expect(screen.getByText('Test')).not.toBeNull()
    expect(screen.getByText('Children')).not.toBeNull()

    await userEvent.type(screen.getAllByRole('textbox')[0], 'test')
    await userEvent.type(screen.getAllByRole('textbox')[1], 'children')
    await userEvent.type(screen.getAllByRole('textbox')[2], 'list')
    await userEvent.click(screen.getByRole('button'))

    expect(value).toEqual({
      test: 'test',
      children: 'children',
      list: ['list'],
    })
  })
})
