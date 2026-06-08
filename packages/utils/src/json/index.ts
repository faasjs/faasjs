import type { ZodOutput, ZodType } from '../zod'
import { isObjectRecord } from '../zod'

/**
 * Parses a JSON string into a JavaScript value.
 *
 * @template T - Expected parsed value type. Without a schema, this is a TypeScript assertion.
 * @param value - The JSON string to parse.
 * @returns The parsed JavaScript value.
 * @throws {Error} If the input is not a string.
 * @throws {SyntaxError} If the string is not valid JSON.
 */
export function parseJson<T = unknown>(value: unknown): T
/**
 * Parses a JSON string and validates the parsed value with a Zod schema.
 *
 * @template Schema - Zod schema used to validate and type the parsed value.
 * @param value - The JSON string to parse.
 * @param schema - Zod schema used to validate the parsed value.
 * @returns The Zod schema output.
 * @throws {Error} If the input is not a string.
 * @throws {SyntaxError} If the string is not valid JSON.
 * @throws {ZodError} If schema validation fails.
 */
export function parseJson<Schema extends ZodType>(value: unknown, schema: Schema): ZodOutput<Schema>
export function parseJson(value: unknown, schema?: ZodType): unknown {
  if (typeof value !== 'string') throw Error('Invalid JSON string')

  const parsed = JSON.parse(value.trim())

  return schema ? schema.parse(parsed) : parsed
}

/**
 * Normalizes JSON-like input into an object record.
 *
 * Existing object records are returned as-is. JSON strings are parsed and cast to `T`;
 * callers should validate untrusted parsed values with a schema when shape matters.
 *
 * @template T - Expected object record type.
 * @param {unknown} value - Existing object or JSON string payload.
 * @returns Existing object record or parsed JSON value cast to `T`.
 */
export const parseObjectFromJson = <T extends Record<string, unknown>>(value: unknown): T => {
  if (isObjectRecord(value)) return value as T

  return parseJson(value) as T
}

/**
 * Normalizes JSON-like input into an array.
 *
 * Existing arrays are returned as-is. JSON strings are parsed and cast to `T`;
 * callers should validate untrusted parsed values with a schema when shape matters.
 *
 * @template T - Expected array type.
 * @param {unknown} value - Existing array or JSON string payload.
 * @returns Existing array or parsed JSON value cast to `T`.
 */
export const parseArrayFromJson = <T extends unknown[]>(value: unknown): T => {
  if (Array.isArray(value)) return value as T

  return parseJson(value) as T
}
