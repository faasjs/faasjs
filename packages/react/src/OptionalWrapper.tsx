import type { ComponentProps, ComponentType, ReactNode } from 'react'

/**
 * Props for the {@link OptionalWrapper} helper component.
 *
 * @template TWrapper - Wrapper component type used when `condition` is true.
 */
export type OptionalWrapperProps<TWrapper extends ComponentType<{ children: ReactNode }> = any> = {
  condition: boolean
  Wrapper: TWrapper
  wrapperProps?: ComponentProps<TWrapper>
  children: ReactNode
}

/**
 * A wrapper component that conditionally wraps its children with a provided wrapper component.
 *
 * @param props - Wrapper condition, wrapper component, and child content.
 * @param props.condition - When `true`, wrap children with `Wrapper`.
 * @param props.Wrapper - Component used as the wrapper when the condition passes.
 * @param props.wrapperProps - Props forwarded to the wrapper component.
 * @param props.children - Content rendered directly or inside the wrapper.
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
export function OptionalWrapper(props: OptionalWrapperProps) {
  const { condition, Wrapper, wrapperProps, children } = props

  if (condition) return <Wrapper {...wrapperProps}>{children}</Wrapper>

  return children
}

OptionalWrapper.displayName = 'OptionalWrapper'
