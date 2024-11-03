/**
 * @jest-environment @happy-dom/jest-environment
 */

import { Form } from '../../Form'

describe('Form/base', () => {
  it('should work', () => {
    expect(Form).toBeDefined()
    expect(Form.useForm).toBeDefined()
  })
})
