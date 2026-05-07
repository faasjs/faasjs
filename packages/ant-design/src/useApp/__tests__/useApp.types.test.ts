import { assertType, it } from 'vitest'

import type { useApp } from '../../useApp'
import { type useAppProps } from '../../useApp'

type IsAny<T> = 0 extends 1 & T ? true : false

it('useApp keeps its declaration types after packing', () => {
  assertType<IsAny<typeof useApp>>(false)
  assertType<Readonly<useAppProps>>({} as ReturnType<typeof useApp>)
})
