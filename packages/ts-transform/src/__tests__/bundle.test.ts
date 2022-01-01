import { bundle } from '..'

describe('bundle', () => {
  it('import file', async () => {
    const res = await bundle({ filename: require.resolve('./import.ts') })

    expect(res.code).toEqual('const content = \'imported\';\nexport { content as default };\n')
  })

  it('require file', async () => {
    const res = await bundle({ filename: require.resolve('./require.ts') })

    console.log(res.code)

    expect(res.code).toContain(`var load = __swcpack_require__.bind(void 0, function(module, exports) {
    module.exports = 'required';
});
// eslint-disable-next-line @typescript-eslint/no-var-requires
const required = load();
export { required as default };
`)
  })
})
