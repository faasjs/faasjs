import { resolvePageQuery } from '@faasjs/react/routing'

import { createGreeting } from '../greeting/createGreeting'

type HomePageState = {
  initialName: string
  initialMessage: string
}

function getDefaultPathname(): string {
  return typeof window === 'undefined' ? '/' : window.location.pathname || '/'
}

function getDefaultSearch(): string {
  return typeof window === 'undefined' ? '' : window.location.search
}

export function getCurrentPathname(pathname = getDefaultPathname()): string {
  return pathname || '/'
}

export function getHomePageState(search = getDefaultSearch()): HomePageState {
  const query = resolvePageQuery(search)
  const rawName = query.name
  const initialName = (Array.isArray(rawName) ? rawName[0] : rawName)?.trim() || 'FaasJS'

  return {
    initialName,
    initialMessage: createGreeting(initialName).message,
  }
}

export function getDocsRestPath(pathname = getDefaultPathname()): string {
  if (pathname === '/docs') return '/'
  if (pathname.startsWith('/docs/')) return pathname.slice('/docs'.length)

  return pathname || '/'
}
