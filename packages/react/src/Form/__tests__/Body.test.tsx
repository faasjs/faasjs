import { render, screen } from '@testing-library/react'
import { FormBody } from '../Body'
import { FormContextProvider } from '../context'
import { FormDefaultElements } from '../elements'

const renderWithContext = (ui: React.ReactElement, { items = [] } = {}) =>
  render(
    <FormContextProvider
      value={
        { items, Elements: FormDefaultElements, values: {}, errors: {} } as any
      }
    >
      {ui}
    </FormContextProvider>
  )

describe('FormBody', () => {
  it('should render FormLabel components based on items from context', () => {
    const items = [{ name: 'item1' }, { name: 'item2' }]

    renderWithContext(<FormBody />, { items })

    for (const item of items) {
      expect(screen.getByText(item.name)).not.toBeNull()
    }
  })

  it('should render nothing if items are empty', () => {
    const { container } = renderWithContext(<FormBody />)

    expect(container.firstChild).toBeNull()
  })
})
