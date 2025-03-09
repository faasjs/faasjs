/**
 * Formats a string using placeholders and arguments.
 *
 * The function supports the following placeholders:
 * - `%o`: Formats the argument as a JSON string if it's an array, otherwise falls through to `%s`.
 * - `%s`: Converts the argument to a string.
 * - `%d`: Converts the argument to a number.
 * - `%j`: Formats the argument as a JSON string.
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
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
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
