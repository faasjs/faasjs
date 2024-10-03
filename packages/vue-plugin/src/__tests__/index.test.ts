/**
 * @jest-environment @happy-dom/jest-environment
 */
import { mount } from '@vue/test-utils'
import { FaasVuePlugin } from '..'

describe('FaasVuePlugin', () => {
  it('should work', () => {
    const vue = mount(
      {},
      { global: { plugins: [[FaasVuePlugin, { domain: '/' }]] } }
    )

    expect(vue.vm.$faas).toBeDefined()
  })
})
