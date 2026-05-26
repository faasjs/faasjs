import { isObjectRecord } from '../zod'

/**
 * Parses a JSON string into a JavaScript value.
 *
 * @param value - The JSON string to parse.
 * @returns The parsed JavaScript value.
 * @throws {Error} If the input is not a string.
 * @throws {SyntaxError} If the string is not valid JSON.
 */
export const parseJson = <T extends unknown>(value: unknown): T => {
  if (typeof value !== 'string') throw Error('Invalid JSON string')

  return JSON.parse(value.trim()) as T
}

/**
 * Normalizes JSON-like input into an object record.
 *
 * This accepts an existing object value or a JSON string.
 *
 * @param {unknown} value - Existing object or JSON string payload.
 * @returns Parsed object record
 */
export const parseObjectFromJson = <T extends Record<string, unknown>>(value: unknown): T => {
  if (isObjectRecord(value)) return value as T

  return parseJson(value) as T
}

/**
 * Normalizes JSON-like input into an array.
 *
 * @param {unknown} value - Existing array or JSON string payload.
 * @returns Parsed array
 */
export const parseArrayFromJson = <T extends unknown[]>(value: unknown): T => {
  if (Array.isArray(value)) return value as T

  return parseJson(value) as T
}
