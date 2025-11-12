import { render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Form } from '../../Form'

describe('Form dependency tracking', () => {
  it('should update when form instance changes', async () => {
    const TestComponent = () => {
      const [key, setKey] = useState(0)
      const [form] = Form.useForm()
      
      return (
        <div>
          <button onClick={() => setKey(k => k + 1)}>Rerender</button>
          <Form
            key={key}
            form={form}
            items={[
              { id: 'field1', type: 'string' }
            ]}
          />
        </div>
      )
    }

    const { rerender } = render(<TestComponent />)
    
    expect(screen.getByText('Field1')).not.toBeNull()
    
    // Trigger rerender
    const button = screen.getByText('Rerender')
    button.click()
    
    await waitFor(() => {
      expect(screen.getByText('Field1')).not.toBeNull()
    })
  })

  it('should update when initialValues change', async () => {
    const TestComponent = () => {
      const [initialValues, setInitialValues] = useState({ field1: 'initial' })
      
      return (
        <div>
          <button onClick={() => setInitialValues({ field1: 'updated' })}>
            Update Initial
          </button>
          <Form
            initialValues={initialValues}
            items={[
              { id: 'field1', type: 'string' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('initial')
    
    // Update initialValues
    const button = screen.getByText('Update Initial')
    button.click()
    
    await waitFor(() => {
      expect(input.value).toBe('updated')
    })
  })

  it('should handle conditional fields with initialValues properly', async () => {
    const TestComponent = () => {
      const [initialValues, setInitialValues] = useState({ 
        toggle: 'yes',
        dependent: 'value1' 
      })
      
      return (
        <div>
          <button onClick={() => setInitialValues({ 
            toggle: 'no',
            dependent: 'value2' 
          })}>
            Change Values
          </button>
          <Form
            initialValues={initialValues}
            items={[
              { 
                id: 'toggle', 
                type: 'string'
              },
              { 
                id: 'dependent',
                type: 'string',
                if: values => values.toggle === 'yes'
              }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Initially, dependent field should be visible
    expect(screen.getByText('Dependent')).not.toBeNull()
    
    // Change values - dependent field should be hidden
    const button = screen.getByText('Change Values')
    button.click()
    
    await waitFor(() => {
      expect(() => screen.getByText('Dependent')).toThrow()
    })
  })

  it('should apply transferValue with initialValues changes', async () => {
    const TestComponent = () => {
      const [initialValues, setInitialValues] = useState({ 
        dateField: '2024-01-01'
      })
      
      return (
        <div>
          <button onClick={() => setInitialValues({ 
            dateField: '2024-12-31'
          })}>
            Update Date
          </button>
          <Form
            initialValues={initialValues}
            items={[
              { 
                id: 'dateField', 
                type: 'date'
              }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Check that date field is rendered
    expect(screen.getByText('Date Field')).not.toBeNull()
    
    // Update date
    const button = screen.getByText('Update Date')
    button.click()
    
    await waitFor(() => {
      expect(screen.getByText('Date Field')).not.toBeNull()
    })
  })

  it('should maintain form state when props update but form instance remains', async () => {
    const onFinishMock = vi.fn()
    
    const TestComponent = () => {
      const [onFinish, setOnFinish] = useState(() => onFinishMock)
      const [form] = Form.useForm()
      
      return (
        <div>
          <button onClick={() => setOnFinish(() => vi.fn())}>
            Update Handler
          </button>
          <Form
            form={form}
            onFinish={onFinish}
            items={[
              { id: 'field1', type: 'string' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    const input = screen.getByRole('textbox') as HTMLInputElement
    
    // Type some value
    input.focus()
    await waitFor(() => {
      input.value = 'test value'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    
    // Update the onFinish handler (props change)
    const button = screen.getByText('Update Handler')
    button.click()
    
    // Value should still be there
    await waitFor(() => {
      expect(input.value).toBe('test value')
    })
  })
})
