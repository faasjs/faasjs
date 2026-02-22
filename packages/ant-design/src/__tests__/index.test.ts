import { describe, expect, it } from 'vitest'
import * as antDesign from '../index'

describe('index', () => {
  it('should export major APIs', () => {
    expect(antDesign.App).toBeDefined()
    expect(antDesign.ConfigProvider).toBeDefined()
    expect(antDesign.Form).toBeDefined()
    expect(antDesign.FormItem).toBeDefined()
    expect(antDesign.Description).toBeDefined()
    expect(antDesign.Table).toBeDefined()
    expect(antDesign.Routes).toBeDefined()
    expect(antDesign.PageNotFound).toBeDefined()
    expect(antDesign.useThemeToken).toBeDefined()
  })
})
