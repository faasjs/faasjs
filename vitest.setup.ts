import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { beforeEach } from 'vitest'

GlobalRegistrator.register()

beforeEach(() => {
  if (typeof document === 'undefined') return

  document.body.innerHTML = ''
  window.location.href = 'http://localhost/'
  window.fetch = fetch
})
