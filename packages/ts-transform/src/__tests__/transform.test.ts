import { transform } from '..'

describe('transform', () => {
  it('should work', async () => {
    expect(transform("const a: string = 'a'")).toEqual({
      code: '"use strict";\nconst a = \'a\';\n',
    })
  })
})
