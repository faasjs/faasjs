const EXTERNAL_LINK_RE = /^(?:[a-zA-Z][a-zA-Z\d+.-]*:|\/\/)/

export function isExternalLink(href: string): boolean {
  return EXTERNAL_LINK_RE.test(href)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ')
}

export function renderAutoLink(options: {
  text: string
  href: string
  active?: boolean
  extraClass?: string
}): string {
  const external = isExternalLink(options.href)
  const classes = classNames(
    'auto-link',
    !external && 'route-link',
    options.active && 'route-link-active',
    external && 'external-link',
    options.extraClass,
  )
  const attributes = external ? ' rel="noopener noreferrer" target="_blank"' : ''

  return `<a class="${classes}" href="${escapeHtml(options.href)}" aria-label="${escapeHtml(options.text)}"${attributes}>${escapeHtml(options.text)}</a>`
}
