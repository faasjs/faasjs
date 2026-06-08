import { z as _z } from 'zod'
export type {
  ZodType,
  ZodError,
  input as ZodInput,
  output as ZodOutput,
  infer as ZodInfer,
  RefinementCtx as ZodRefinementCtx,
  ZodSafeParseResult,
  ZodSafeParseError,
  ZodSafeParseSuccess,
} from 'zod'

/**
 * Extended Zod with custom helpers.
 *
 * @property {() => _z.ZodNumber} positiveint - Returns `z.int().gt(0)` for positive integer validation.
 * @property {() => _z.ZodString} nonemptystring - Returns `z.string().min(1)` for non-empty string validation.
 */
export type Z = typeof _z & {
  positiveint: () => _z.ZodNumber
  nonemptystring: () => _z.ZodString
}

const extendedZod = Object.assign(Object.create(Object.getPrototypeOf(_z)), _z)

/**
 * Extended Zod instance with custom helpers.
 *
 * Currently includes:
 * - `positiveint()`: returns `z.int().gt(0)`.
 * - `nonemptystring()`: returns `z.string().min(1)`.
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

/**
 * Type guard that checks whether a value is an object record.
 *
 * Uses Zod's `safeParse` to check the coarse object shape. It does not validate
 * any required keys or value shapes; use an explicit Zod schema for trusted
 * business data. Returns `false` for arrays, null, primitives, and other
 * non-object values.
 *
 * @param {unknown} value - Value to check.
 * @returns `true` if the value is an object record.
 *
 * @example
 * ```ts
 * import { isObjectRecord } from '@faasjs/utils'
 *
 * isObjectRecord({ a: 1 }) // true
 * isObjectRecord([1, 2, 3]) // false
 * isObjectRecord('hello') // false
 * isObjectRecord(null) // false
 * ```
 */
export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return _z.object().safeParse(value).success
}
