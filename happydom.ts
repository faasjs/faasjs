import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { beforeEach } from 'bun:test'
import { fetch } from 'bun'

GlobalRegistrator.register()

beforeEach(() => {
  document.body.innerHTML = ''
  window.location.href = 'http://localhost/'
  window.fetch = fetch
})
