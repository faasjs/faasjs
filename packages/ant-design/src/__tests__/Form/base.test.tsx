/**
 * @jest-environment jsdom
 */
import { Form } from '../../Form'

describe('Form/base', () => {
  it('should work', () => {
    expect(Form).toBeDefined()
    expect(Form.useForm).toBeDefined()
  })
})
