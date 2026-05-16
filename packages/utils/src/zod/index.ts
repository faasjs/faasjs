import { z as zod } from 'zod'
export type { ZodType, ZodError, input, output } from 'zod'

/**
 * Extended Zod with custom helpers.
 */
export type Z = typeof zod & {
  positiveint: () => zod.ZodNumber
  nonemptystring: () => zod.ZodString
}

const extendedZod = Object.assign(Object.create(Object.getPrototypeOf(zod)), zod)

/**
 * Extended Zod instance with custom helpers.
 *
 * Currently includes:
 * - `positiveint()`: A helper that returns a Zod schema for positive integers.
 * - `nonemptystring()`: A helper that returns a Zod schema for non-empty strings.
 *
 * @example
 * ```ts
 * import { z } from '@faasjs/utils'
 *
 * const schema = z.positiveint().min(1).max(100)
 *
 * console.log(schema.parse(50)) // 50
 * console.log(schema.parse(-1)) // throws ZodError
 * console.log(schema.parse(101)) // throws ZodError
 * ```
 */
export const z: Z = Object.assign(extendedZod, {
  positiveint: () => extendedZod.int().gt(0),
  nonemptystring: () => extendedZod.string().min(1),
})
