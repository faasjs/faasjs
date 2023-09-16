import { bundle } from '..'

describe('bundle', () => {
  it('import file', async () => {
    const res = await bundle({ filename: require.resolve('./import.ts') })

    expect(res.code).toEqual(
      "const content = 'imported';\nexport { content as default };\n"
    )
  })

  it('require file', async () => {
    const res = await bundle({ filename: require.resolve('./require.ts') })

    expect(res.code).toContain('function __swcpack_require__(mod) {')
  })
})
