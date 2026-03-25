import { useFunc } from '@faasjs/core'
import { useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  useHttp()

  return async ({ params }) => {
    if (!params.b) throw new Error('[params] b is required.')
  }
})
