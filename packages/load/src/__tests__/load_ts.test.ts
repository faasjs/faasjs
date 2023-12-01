import { loadTs } from '../load_ts'

describe('loadTs', () => {
  test('extend', async () => {
    const res = await loadTs(require.resolve('./extend.ts'), { tmp: true })

    expect(res.module).toEqual('extended')
    expect(res.dependencies).toEqual({})
  })

  test('require', async () => {
    const res = await loadTs(require.resolve('./require.ts'), { tmp: true })

    expect(res.module.default).toEqual('required')
    expect(res.dependencies).toEqual({})
  })

  test('modules', async () => {
    const res = await loadTs(require.resolve('./extend.ts'), {
      tmp: true,
      modules: { additions: ['@faasjs/load'] },
    })

    expect(res.modules).toEqual({})
  })
})
