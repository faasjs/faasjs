import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it } from 'vitest'
import { action } from '../commands/new'

describe('new', () => {
  describe('func', () => {
    afterEach(() => {
      execSync(`rm -rf ${__dirname}/tmp`)
    })

    it('basic', () => {
      action('func', 'packages/cli/src/__tests__/tmp/basic', [])

      expect(
        readFileSync(`${__dirname}/tmp/basic.func.ts`).toString()
      ).toEqual(`import { useFunc } from '@faasjs/func'

export const func = useFunc(function () {

  return async function () {
    // let's code
  }
})
`)

      expect(
        readFileSync(`${__dirname}/tmp/__tests__/basic.test.ts`).toString()
      ).toEqual(`import { FuncWarper } from '@faasjs/test'
import { func } from '../basic.func'

describe('basic.func.ts', function () {
  test('should work', async function () {
    const testFunc = new FuncWarper(func)

    const res = await testFunc.handler({})

    expect(res).toEqual({})
  })
})
`)
    })

    it('with plugins', () => {
      action('func', 'packages/cli/src/__tests__/tmp/plugin', ['cf', 'http'])

      expect(
        readFileSync(`${__dirname}/tmp/plugin.func.ts`).toString()
      ).toEqual(`import { useFunc } from '@faasjs/func'
import { useCloudFunction } from '@faasjs/cloud_function'
import { useHttp } from '@faasjs/http'

export const func = useFunc(function () {
  const cf = useCloudFunction()
  const http = useHttp()

  return async function () {
    // let's code
  }
})
`)

      expect(
        readFileSync(`${__dirname}/tmp/__tests__/plugin.test.ts`).toString()
      ).toEqual(`import { FuncWarper } from '@faasjs/test'
import { func } from '../plugin.func'

describe('plugin.func.ts', function () {
  test('should work', async function () {
    const testFunc = new FuncWarper(func)

    const res = await testFunc.handler({})

    expect(res).toEqual({})
  })
})
`)
    })
  })

  it('unknown type', () => {
    try {
      action('unknown', 'unknown', [])
    } catch (error: any) {
      expect(error.message).toEqual(
        'Unknown type: unknown (only support func now)'
      )
    }
  })
})
