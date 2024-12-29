import { beforeEach } from 'vitest'

beforeEach(() => {
  if (typeof document === 'undefined') return

  document.body.innerHTML = ''
  window.location.href = 'http://localhost/'
  window.fetch = fetch
})
