/**
 * # @faasjs/ant-design
 *
 * React UI primitives and data-aware helpers for building FaasJS applications with Ant Design.
 *
 * `@faasjs/ant-design` combines FaasJS request helpers and Ant Design components behind a
 * single public entrypoint.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/ant-design
 * ```
 *
 * ## Highlights
 *
 * - Use {@link App} to wire Ant Design feedback APIs and FaasJS config providers.
 * - Use {@link Form}, {@link Description}, and {@link Table} with shared FaasJS item metadata.
 * - Use {@link faas}, {@link useFaas}, {@link useFaasStream}, {@link FaasDataWrapper}, or {@link withFaasData} to bind UI to FaasJS actions.
 *
 * ## Usage
 *
 * ```tsx
 * import { App, Form } from '@faasjs/ant-design'
 *
 * export default function Page() {
 *   return (
 *     <App>
 *       <Form items={[{ id: 'name', required: true }]} />
 *     </App>
 *   )
 * }
 * ```
 *
 * @packageDocumentation
 */

export * from './App'
export * from './Blank'
export * from './Config'
export * from './Description'
export * from './Drawer'
export * from './data'
export * from './ErrorBoundary'
export * from './FaasDataWrapper'
export * from './Form'
export * from './FormItem'
export * from './Loading'
export * from './Modal'
export * from './Table'
export * from './Tabs'
export * from './Title'
export * from './useApp'
export * from './useThemeToken'
