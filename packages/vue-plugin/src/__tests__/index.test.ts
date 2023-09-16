/**
 * @jest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { FaasVuePlugin } from '..'

describe('FaasVuePlugin', () => {
  it('should work', () => {
    const vue = mount(
      {},
      { global: { plugins: [[FaasVuePlugin, { domain: 'test' }]] } }
    )

    expect(vue.vm.$faas).toBeDefined()
  })
})
