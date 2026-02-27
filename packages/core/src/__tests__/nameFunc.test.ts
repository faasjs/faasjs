import { expect, it } from 'vitest'
import { nameFunc } from '../utils'

it('nameFunc assigns name to handler', () => {
  const originalHandler = () => 'Hello World'
  const namedHandler = nameFunc('myHandler', originalHandler)

  expect(namedHandler.name).toEqual('myHandler')
  expect(namedHandler()).toEqual('Hello World')
})
