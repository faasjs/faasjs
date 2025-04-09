import { useFunc } from '@faasjs/func'

export const func = useFunc(() => {
  return async (event) => {
    return event
  }
})
