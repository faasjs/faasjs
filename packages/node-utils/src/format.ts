/**
 * Format values with placeholder tokens similar to `util.format`.
 *
 * Supported placeholders:
 * - `%o`: Stringify arrays as JSON and otherwise fall through to `%s`.
 * - `%s`: Convert the argument to a string.
 * - `%d`: Convert the argument to a number.
 * - `%j`: Serialize the argument with `JSON.stringify`.
 *
 * @param {any} fmt - Format string or first value to stringify.
 * @param {any[]} args - Additional values consumed by format placeholders.
 * @returns {string} Formatted string.
 *
 * @example
 * ```ts
 * format('User %s has %d tasks', 'alice', 3)
 * // 'User alice has 3 tasks'
 * ```
 */
export function format(fmt: any, ...args: any[]): string {
  const re = /(%?)(%([ojds]))/g

  let fmtString: string

  if (typeof fmt !== 'string') {
    if (fmt instanceof Error) {
      fmtString = `Error: ${fmt.message}\n${fmt.stack}`
    } else if (fmt instanceof Object) {
      fmtString = JSON.stringify(fmt)
    } else {
      fmtString = String(fmt)
    }
  } else fmtString = fmt

  if (args.length)
    fmtString = fmtString.replace(re, (match, escaped, _, flag) => {
      let arg = args.shift()
      switch (flag) {
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: `o` falls back to `%s` unless array
        case 'o':
          if (Array.isArray(arg)) {
            arg = JSON.stringify(arg)
            break
          }
        case 's':
          arg = `${arg}`
          break
        case 'd':
          arg = Number(arg)
          break
        case 'j':
          arg = JSON.stringify(arg)
          break
      }
      if (!escaped) {
        return arg
      }
      args.unshift(arg)
      return match
    })

  if (args.length) fmtString += ` ${args.join(' ')}`

  fmtString = fmtString.replace(/%{2,2}/g, '%')

  return fmtString
}
