/**
 * Structural interface for a FaasJS function.
 */
export interface TFunc {
  config: Record<string, any>
  plugins: Array<{
    name: string
    type: string
    readonly [key: string]: any
  }>
  export(): { handler: (...args: any[]) => Promise<any> }
}
