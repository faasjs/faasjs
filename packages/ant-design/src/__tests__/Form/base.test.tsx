import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Form } from '../../Form'

describe('base', () => {
  it('should work', () => {
    expect(Form).toBeDefined()
    expect(Form.useForm).toBeDefined()
  })
})

describe('if', () => {
  it('should work', async () => {
    render(
      <Form
        items={[
          { id: 'true', if: () => true },
          { id: 'false', if: () => false },
          { id: 'condition', if: values => !!values.true },
        ]}
      />
    )

    expect(screen.getByText('True')).not.toBeNull()
    expect(() => screen.getByText('False')).toThrow()
    expect(() => screen.getByText('Condition')).toThrow()

    await userEvent.type(screen.getByRole('textbox'), 'test')

    expect(screen.getByText('Condition')).not.toBeNull()
  })

  it('should work with initialValues', async () => {
    render(
      <Form
        initialValues={{ true: 'true' }}
        items={[
          { id: 'true', if: () => true },
          { id: 'false', if: () => false },
          { id: 'condition', if: values => !!values.true },
        ]}
      />
    )

    expect(screen.getByText('True')).not.toBeNull()
    expect(() => screen.getByText('False')).toThrow()
    expect(() => screen.getByText('Condition')).not.toBeNull()
  })
})
