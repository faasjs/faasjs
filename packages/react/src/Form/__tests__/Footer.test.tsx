/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, fireEvent } from '@testing-library/react'
import { FormFooter } from '../Footer'
import { FormContextProvider } from '../context'
import { FormDefaultElements } from '../elements'
import { useState } from 'react'

function Provider(props: { ui: React.ReactElement, onSubmit?: () => Promise<void> }) {
  const [submitting, setSubmitting] = useState(false)

  return <FormContextProvider
    value={{ items: [], Elements: FormDefaultElements, values: {}, onSubmit: props.onSubmit, submitting, setSubmitting } as any}
  >
    {props.ui}
  </FormContextProvider>
}

const renderWithContext = (ui: React.ReactElement, { onSubmit }: { onSubmit?: () => Promise<void> } = {}) =>
  render(
    <Provider ui={ui} onSubmit={onSubmit} />
  )

describe('FormFooter', () => {
  it('should render the submit button', () => {
    const { getByText } = renderWithContext(<FormFooter />)

    expect(getByText('Submit')).not.toBeNull()
  })

  it('should call onSubmit and setSubmitting when button is clicked', async () => {
    const { getByText } = renderWithContext(<FormFooter />, { onSubmit: () => new Promise(r => setTimeout(r, 1000)) })
    const button = getByText('Submit') as HTMLButtonElement

    fireEvent.click(button)

    expect(button.disabled).toBeTruthy()
  })
})
