import { Func } from '@faasjs/func'
import { Sql, AdapterType } from '..'

describe('deploy', function () {
  describe('dependencies', function () {
    it.each([
      ['sqlite', 'sqlite3'],
      ['mysql', 'mysql2'],
      ['postgresql', 'pg']
    ])('is %s', async function (type: AdapterType, npm) {
      const sql = new Sql({
        name: 'sql',
        adapterType: type
      })

      const func = new Func({ plugins: [sql] })

      const dependencies = {}

      await func.deploy({
        root: __dirname,
        filename: 'filename',
        dependencies
      })

      expect(dependencies).toEqual({ [npm]: '*' })
    })

    it('else', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'unknown' as 'sqlite'
      })

      const func = new Func({ plugins: [sql] })

      const dependencies = {}

      await expect(func.deploy({
        root: __dirname,
        filename: 'filename',
        dependencies
      })).rejects.toEqual(Error('[Sql] Unsupport type: unknown'))
    })
  })
})
