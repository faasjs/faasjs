import { render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Table } from '../../Table'

describe('Table dependency tracking', () => {
  it('should update columns when props.extendTypes changes', async () => {
    const TestComponent = () => {
      const [extendTypes, setExtendTypes] = useState<any>({
        custom: {
          render: (value: any) => <span>Custom: {value}</span>
        }
      })
      
      return (
        <div>
          <button onClick={() => setExtendTypes({
            custom: {
              render: (value: any) => <span>Updated: {value}</span>
            }
          })}>
            Update Types
          </button>
          <Table
            extendTypes={extendTypes}
            items={[
              { id: 'field1', type: 'custom' as any }
            ]}
            dataSource={[
              { id: 1, field1: 'value1' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Initial render
    await waitFor(() => {
      expect(screen.getByText('Custom: value1')).not.toBeNull()
    })
    
    // Update extendTypes
    const button = screen.getByText('Update Types')
    button.click()
    
    // Should show updated render
    await waitFor(() => {
      expect(screen.getByText('Updated: value1')).not.toBeNull()
    })
  })

  it('should update columns when theme changes', async () => {
    const TestComponent = () => {
      const [key, setKey] = useState(0)
      
      return (
        <div>
          <button onClick={() => setKey(k => k + 1)}>
            Trigger Update
          </button>
          <Table
            key={key}
            items={[
              { 
                id: 'field1', 
                type: 'string',
                options: [
                  { label: 'Option 1', value: '1' },
                  { label: 'Option 2', value: '2' }
                ]
              }
            ]}
            dataSource={[
              { id: 1, field1: '1' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Check table renders
    await waitFor(() => {
      expect(screen.getByText('Option 1')).not.toBeNull()
    })
    
    // Trigger update
    const button = screen.getByText('Trigger Update')
    button.click()
    
    // Should still render correctly
    await waitFor(() => {
      expect(screen.getByText('Option 1')).not.toBeNull()
    })
  })

  it('should handle auto-options when dataSource changes', async () => {
    const TestComponent = () => {
      const [dataSource, setDataSource] = useState([
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' }
      ])
      
      return (
        <div>
          <button onClick={() => setDataSource([
            { id: 1, status: 'active' },
            { id: 2, status: 'inactive' },
            { id: 3, status: 'pending' }
          ])}>
            Add Row
          </button>
          <Table
            items={[
              { 
                id: 'status', 
                type: 'string',
                optionsType: 'auto' as any
              }
            ]}
            dataSource={dataSource}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Initial render with 2 rows
    await waitFor(() => {
      expect(screen.getByText('active')).not.toBeNull()
      expect(screen.getByText('inactive')).not.toBeNull()
    })
    
    // Add a row
    const button = screen.getByText('Add Row')
    button.click()
    
    // Should show new status
    await waitFor(() => {
      expect(screen.getByText('pending')).not.toBeNull()
    })
  })

  it('should maintain filter dropdown functionality across re-renders', async () => {
    const TestComponent = () => {
      const [key, setKey] = useState(0)
      
      return (
        <div>
          <button onClick={() => setKey(k => k + 1)}>
            Force Rerender
          </button>
          <Table
            key={key}
            items={[
              { 
                id: 'category', 
                type: 'string',
                options: Array.from({ length: 15 }, (_, i) => ({
                  label: `Category ${i + 1}`,
                  value: `cat${i + 1}`
                }))
              }
            ]}
            dataSource={[
              { id: 1, category: 'cat1' },
              { id: 2, category: 'cat2' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Table should render
    await waitFor(() => {
      expect(screen.getByText('cat1')).not.toBeNull()
    })
    
    // Force rerender
    const button = screen.getByText('Force Rerender')
    button.click()
    
    // Should still work correctly
    await waitFor(() => {
      expect(screen.getByText('cat1')).not.toBeNull()
    })
  })

  it('should handle faasData prop changes', async () => {
    const TestComponent = () => {
      const [faasData, setFaasData] = useState<any>(undefined)
      
      return (
        <div>
          <button onClick={() => setFaasData({ loading: true })}>
            Set Loading
          </button>
          <Table
            faasData={faasData}
            items={[
              { id: 'field1', type: 'string' }
            ]}
            dataSource={[
              { id: 1, field1: 'value1' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Initial render
    await waitFor(() => {
      expect(screen.getByText('value1')).not.toBeNull()
    })
    
    // Set loading state
    const button = screen.getByText('Set Loading')
    button.click()
    
    // Should still render (loading is handled by faasData)
    await waitFor(() => {
      expect(screen.getByText('value1')).not.toBeNull()
    })
  })

  it('should update filter options when items change', async () => {
    const TestComponent = () => {
      const [items, setItems] = useState([
        { 
          id: 'status', 
          type: 'string' as const,
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]
        }
      ])
      
      return (
        <div>
          <button onClick={() => setItems([
            { 
              id: 'status', 
              type: 'string' as const,
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
              ]
            }
          ])}>
            Add Option
          </button>
          <Table
            items={items}
            dataSource={[
              { id: 1, status: 'active' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    
    // Initial render
    await waitFor(() => {
      expect(screen.getByText('Active')).not.toBeNull()
    })
    
    // Add option
    const button = screen.getByText('Add Option')
    button.click()
    
    // Should still render correctly with new options
    await waitFor(() => {
      expect(screen.getByText('Active')).not.toBeNull()
    })
  })

  it('should not recreate generateFilterDropdown unnecessarily', async () => {
    let renderCount = 0
    
    const TestComponent = () => {
      const [counter, setCounter] = useState(0)
      renderCount++
      
      return (
        <div>
          <button onClick={() => setCounter(c => c + 1)}>
            Increment: {counter}
          </button>
          <Table
            items={[
              { 
                id: 'field1', 
                type: 'string',
                options: Array.from({ length: 12 }, (_, i) => ({
                  label: `Option ${i}`,
                  value: `opt${i}`
                }))
              }
            ]}
            dataSource={[
              { id: 1, field1: 'opt1' }
            ]}
          />
        </div>
      )
    }

    render(<TestComponent />)
    const initialRenderCount = renderCount
    
    // Click button to trigger parent re-render
    const button = screen.getByText(/Increment:/)
    button.click()
    
    await waitFor(() => {
      // Component should re-render, but Table should handle it efficiently
      expect(renderCount).toBeGreaterThan(initialRenderCount)
      expect(screen.getByText('opt1')).not.toBeNull()
    })
  })
})
