import { act, render, screen } from '@testing-library/react'
import type { Dispatch, JSX, ReactNode, SetStateAction } from 'react'
import { describe, expect, it } from 'vitest'

type DialogProps = {
  children?: ReactNode
  open?: boolean
  title?: ReactNode
}

type DialogHookOptions<TProps extends DialogProps, TResult> = {
  clearedPropNames: (keyof TProps)[]
  children: TProps['children']
  getElement: (result: TResult) => JSX.Element
  getProps: (result: TResult) => TProps
  getSetProps: (result: TResult) => Dispatch<SetStateAction<TProps>>
  name: string
  preservedProps: Partial<TProps>
  useHook: (init?: TProps) => TResult
}

export function describeDialogHook<TProps extends DialogProps, TResult>({
  clearedPropNames,
  children,
  getElement,
  getProps,
  getSetProps,
  name,
  preservedProps,
  useHook,
}: DialogHookOptions<TProps, TResult>) {
  describe(name, () => {
    it('should work', async () => {
      let setProps: Dispatch<SetStateAction<TProps>> | undefined

      function App() {
        const result = useHook({
          open: true,
          title: 'title',
        } as TProps)

        if (!setProps) setProps = getSetProps(result)

        return getElement(result)
      }

      render(<App />)

      expect(screen.getByText('title')).toBeDefined()

      if (!setProps) throw Error('setProps not initialized')
      setProps({ title: 'new title' } as TProps)

      expect(await screen.findByText('new title')).toBeDefined()
    })

    it('should work with handler', async () => {
      let setProps: Dispatch<SetStateAction<TProps>> | undefined

      function App() {
        const result = useHook({
          open: true,
          title: 'title',
        } as TProps)

        if (!setProps) setProps = getSetProps(result)

        return getElement(result)
      }

      render(<App />)

      expect(screen.getByText('title')).toBeDefined()

      if (!setProps) throw Error('setProps not initialized')
      const updateProps = setProps
      act(() => updateProps((prev) => ({ ...prev, title: 'new title' })))

      expect(await screen.findByText('new title')).toBeDefined()

      let previousTitle: TProps['title'] | undefined
      act(() =>
        updateProps((prev) => {
          previousTitle = prev.title

          return { ...prev, title: 'new title again' }
        }),
      )

      expect(previousTitle).toBe('new title')
      expect(await screen.findByText('new title again')).toBeDefined()
    })

    it('should reset props when open is false and preserve props otherwise', async () => {
      let result: TResult

      function App() {
        result = useHook()

        return getElement(result)
      }

      render(<App />)

      act(() =>
        getSetProps(result!)({
          children,
          open: true,
          title: 'title',
        } as TProps),
      )

      expect(await screen.findByText('title')).toBeDefined()
      expect(screen.getByText('content')).toBeDefined()

      act(() =>
        getSetProps(result!)({
          open: true,
          ...preservedProps,
        } as TProps),
      )

      expect(getProps(result!)).toMatchObject({
        open: true,
        title: 'title',
        ...preservedProps,
      })
      expect(getProps(result!).children).toBeDefined()

      act(() => getSetProps(result!)((prev) => ({ ...prev, open: false })))

      expect(getProps(result!)).toMatchObject({
        open: false,
      })

      for (const propName of clearedPropNames) expect(getProps(result!)[propName]).toBeUndefined()

      act(() =>
        getSetProps(result!)({
          open: true,
          title: 'new title',
        } as TProps),
      )

      expect(await screen.findByText('new title')).toBeDefined()
      expect(getProps(result!)).toMatchObject({
        open: true,
        title: 'new title',
      })

      for (const propName of clearedPropNames.filter((propName) => propName !== 'title'))
        expect(getProps(result!)[propName]).toBeUndefined()
    })
  })
}
