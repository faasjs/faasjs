/**
 * Backward-compatible re-exports for the legacy routing client entrypoint.
 *
 * Prefer importing from `./routing_client` directly in new code.
 */
export { bootstrap } from './routing_client'
export type { AutoPagesClientOptions, RoutingClientOptions } from './routing_client'
