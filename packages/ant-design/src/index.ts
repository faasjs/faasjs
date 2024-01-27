/**
 * UI components based on [FaasJS](https://faasjs.com), [Ant Design](https://ant.design) and [React Router](https://reactrouter.com).
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/ant-design.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/ant-design/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/ant-design.svg)](https://www.npmjs.com/package/@faasjs/ant-design)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/ant-design
 * ```
 *
 * ## Usage
 *
 * In `@faasjs/ant-design`, we use `FaasItemProps` to provide data structures for components.
 *
 * ```ts
 * type FaasItemType =
 *   'string' | 'string[]' |
 *   'number' | 'number[]' |
 *   'boolean' |
 *   'date' | 'time' |
 *   'object' | 'object[]'
 *
 * type FaasItemProps = {
 *   type: FaasItemTypes
 *   id: string
 *   title?: string
 * }
 * ```
 * @packageDocumentation
 */

export { faas, useFaas } from '@faasjs/react'

export * from './App'
export * from './Blank'
export * from './Config'
export * from './data'
export * from './Description'
export * from './Drawer'
export * from './ErrorBoundary'
export * from './FaasDataWrapper'
export * from './Form'
export * from './FormItem'
export * from './Link'
export * from './Loading'
export * from './Modal'
export * from './Routers'
export * from './Table'
export * from './Tabs'
export * from './Title'
