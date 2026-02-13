import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

function createDom(options: {
  htmlPath: string
  appScript: string
  pageUrl: string
}): JSDOM {
  const html = readFileSync(options.htmlPath, 'utf8')
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: options.pageUrl,
  })

  dom.window.eval(options.appScript)
  return dom
}

function testSidebarInteractions(dom: JSDOM): void {
  const document = dom.window.document
  const container = document.querySelector('.vp-theme-container')
  const sidebarButton = document.querySelector('.vp-toggle-sidebar-button')
  const sidebarMask = document.querySelector('.vp-sidebar-mask')

  assert(container, 'missing .vp-theme-container')
  assert(sidebarButton, 'missing .vp-toggle-sidebar-button')
  assert(sidebarMask, 'missing .vp-sidebar-mask')

  assert(
    !container.classList.contains('sidebar-open'),
    'sidebar should be closed by default'
  )

  sidebarButton.dispatchEvent(
    new dom.window.MouseEvent('click', { bubbles: true })
  )
  assert(
    container.classList.contains('sidebar-open'),
    'sidebar should open after click'
  )
  assert(
    sidebarButton.getAttribute('aria-expanded') === 'true',
    'sidebar aria-expanded should be true after open'
  )

  sidebarMask.dispatchEvent(
    new dom.window.MouseEvent('click', { bubbles: true })
  )
  assert(
    !container.classList.contains('sidebar-open'),
    'sidebar should close when mask clicked'
  )
  assert(
    sidebarButton.getAttribute('aria-expanded') === 'false',
    'sidebar aria-expanded should be false after close'
  )

  sidebarButton.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
  )
  assert(
    container.classList.contains('sidebar-open'),
    'sidebar should open on Enter key'
  )

  sidebarButton.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true })
  )
  assert(
    container.classList.contains('sidebar-open') === false,
    'sidebar should toggle on Space key'
  )

  sidebarButton.dispatchEvent(
    new dom.window.MouseEvent('click', { bubbles: true })
  )
  assert(
    container.classList.contains('sidebar-open'),
    'sidebar should open before Escape test'
  )

  document.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  )
  assert(
    !container.classList.contains('sidebar-open'),
    'sidebar should close on Escape'
  )
}

function testDropdownInteractions(dom: JSDOM): void {
  const document = dom.window.document
  const wrappers = Array.from(
    document.querySelectorAll('.vp-navbar-dropdown-wrapper')
  )

  assert(wrappers.length > 0, 'missing .vp-navbar-dropdown-wrapper')

  const first = wrappers[0] as Element
  const desktopButton = first.querySelector(
    '.vp-navbar-dropdown-title'
  ) as Element | null
  const mobileButton = first.querySelector(
    '.vp-navbar-dropdown-title-mobile'
  ) as Element | null
  const trigger = mobileButton ?? desktopButton

  assert(trigger, 'missing dropdown trigger button')
  assert(
    !first.classList.contains('open'),
    'dropdown should be closed by default'
  )

  trigger.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  assert(first.classList.contains('open'), 'dropdown should open after click')

  document.body.dispatchEvent(
    new dom.window.MouseEvent('click', { bubbles: true })
  )
  assert(
    !first.classList.contains('open'),
    'dropdown should close after outside click'
  )

  trigger.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  assert(
    first.classList.contains('open'),
    'dropdown should open before Escape test'
  )

  document.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  )
  assert(!first.classList.contains('open'), 'dropdown should close on Escape')
}

const scriptPath = fileURLToPath(import.meta.url)
const scriptsDirectory = dirname(scriptPath)
const docsRoot = resolve(scriptsDirectory, '..')
const distRoot = join(docsRoot, 'dist')
const appScriptPath = join(distRoot, 'assets', 'app.js')
const guidePagePath = join(distRoot, 'guide', 'index.html')
const homePagePath = join(distRoot, 'index.html')

if (
  !existsSync(appScriptPath) ||
  !existsSync(guidePagePath) ||
  !existsSync(homePagePath)
) {
  throw new Error('Missing dist assets. Run npm run build first.')
}

const appScript = readFileSync(appScriptPath, 'utf8')

const guideDom = createDom({
  htmlPath: guidePagePath,
  appScript,
  pageUrl: 'https://faasjs.com/guide/',
})
testSidebarInteractions(guideDom)
testDropdownInteractions(guideDom)

const homeDom = createDom({
  htmlPath: homePagePath,
  appScript,
  pageUrl: 'https://faasjs.com/',
})
testDropdownInteractions(homeDom)

console.log('Mobile interaction check passed.')
