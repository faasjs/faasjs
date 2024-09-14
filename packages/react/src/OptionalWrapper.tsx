import type { ComponentProps, ComponentType, ReactNode } from 'react'

export type OptionalWrapperProps<
  TWrapper extends ComponentType<{ children: ReactNode }> = any,
> = {
  condition: boolean
  Wrapper: TWrapper
  wrapperProps?: ComponentProps<TWrapper>
  children: ReactNode
}

/**
 * A wrapper component that conditionally wraps its children with a provided wrapper component.
 *
 * @example
 * ```tsx
 * import { OptionalWrapper } from '@faasjs/react'
 *
 * const Wrapper = ({ children }: { children: React.ReactNode }) => (
 *   <div className='wrapper'>{children}</div>
 * )
 *
 * const App = () => (
 *   <OptionalWrapper condition={true} Wrapper={Wrapper}>
 *     <span>Test</span>
 *   </OptionalWrapper>
 * )
 * ```
 */
export const OptionalWrapper: React.FC<OptionalWrapperProps> & {
  whyDidYouRender: boolean
} = ({ condition, Wrapper, wrapperProps, children }) => {
  return condition ? (
    <Wrapper {...wrapperProps}>{children}</Wrapper>
  ) : (
    <>{children}</>
  )
}

OptionalWrapper.whyDidYouRender = true
