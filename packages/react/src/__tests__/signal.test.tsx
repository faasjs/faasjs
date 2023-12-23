/**
 * @jest-environment jsdom
 */
import '@preact/signals-react/auto'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signal, useSignalState } from '../signal'

describe('signal', () => {
  it('should work with debug', () => {
    const logs: any[] = []
    console.debug = jest.fn().mockImplementation((...args) => logs.push(args))

    const state = signal(0, { debugName: 'signal' })

    expect(state.value).toBe(0)

    state.value = 1

    expect(state.value).toBe(1)

    expect(logs).toEqual([
      ['signal', 0],
      ['signal', 1],
    ])
  })
})

describe('useSignalState', () => {
  test('should work', async () => {
    function Test() {
      const [state, setState] = useSignalState(0, {
        debugName: 'useSignalState',
      })

      return (
        <div>
          {state}
          <button type='button' onClick={() => setState(1)} />
          <button type='button' onClick={() => setState(prev => prev + 2)} />
        </div>
      )
    }

    render(<Test />)

    expect(screen.getByText('0')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button')[0])

    expect(await screen.findByText('1')).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button')[1])

    expect(await screen.findByText('3')).toBeInTheDocument()
  })
})
