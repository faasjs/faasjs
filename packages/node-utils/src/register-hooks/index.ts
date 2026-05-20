import { registerHooks } from 'node:module'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!(specifier.startsWith('.') || specifier.startsWith('/')))
      return nextResolve(specifier, context)
    if (/\.\w+$/.test(specifier)) return nextResolve(specifier, context)

    try {
      return nextResolve(specifier + '.ts', context)
    } catch {
      try {
        return nextResolve(specifier + '/index.ts', context)
      } catch {
        return nextResolve(specifier, context)
      }
    }
  },
})

const { registerNodeModuleHooks } = await import('../load-package')
registerNodeModuleHooks()
