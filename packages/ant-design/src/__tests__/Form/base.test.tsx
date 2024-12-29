import { describe, expect, it } from 'vitest'
import { Form } from '../../Form'

describe('Form/base', () => {
  it('should work', () => {
    expect(Form).toBeDefined()
    expect(Form.useForm).toBeDefined()
  })
})
