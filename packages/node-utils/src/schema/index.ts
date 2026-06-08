import type { ZodOutput, ZodError, ZodType } from '@faasjs/utils'

/**
 * Parsed value type for an optional Zod schema.
 *
 * When a schema is present, the type is the schema's output type. When the
 * schema is omitted, the caller-provided fallback type is used instead because
 * the raw value is not parsed.
 */
export type SchemaOutput<
  TSchema extends ZodType | undefined = undefined,
  TFallback = Record<string, never>,
> = TSchema extends ZodType ? ZodOutput<NonNullable<TSchema>> : TFallback

/**
 * Options for parsing an unknown value with an optional Zod schema.
 *
 * This is useful for runtime boundaries where a schema may be optional, such as
 * API params, job payloads, or plugin config.
 *
 * @template TSchema - Zod schema used when present.
 * @template TFallback - Value and output type used when the schema is omitted.
 */
export type ParseSchemaValueOptions<
  TSchema extends ZodType | undefined = undefined,
  TFallback = Record<string, never>,
> = {
  /**
   * Optional Zod schema used to parse the value.
   */
  schema?: TSchema | undefined
  /**
   * Raw value to parse.
   */
  value: unknown
  /**
   * Value returned without a schema and parsed when the raw value is nullish.
   *
   * Defaults to an empty object when omitted.
   */
  defaultValue?: TFallback | undefined
  /**
   * First line for formatted validation failures.
   */
  errorMessage: string
  /**
   * Optional factory for wrapping the formatted validation message.
   */
  createError?: (message: string) => Error
}

function normalizeIssueMessage(message: string): string {
  return message.replace(': expected', ', expected').replace(/>=\s+/g, '>=').replace(/<=\s+/g, '<=')
}

/**
 * Format a Zod validation error with FaasJS' boundary-validation message style.
 *
 * Each Zod issue is rendered on its own line with a dot-joined path, or `<root>`
 * for root-level issues.
 *
 * @param {ZodError} error - Zod validation error to format.
 * @param {string} message - First line of the formatted message.
 * @returns {string} Multi-line formatted validation message.
 */
export function formatSchemaError(error: ZodError, message: string): string {
  const lines = [message]

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.map((item) => String(item)).join('.') : '<root>'

    lines.push(`${path}: ${normalizeIssueMessage(issue.message)}`)
  }

  return lines.join('\n')
}

/**
 * Parse a value with an optional Zod schema.
 *
 * If `schema` is omitted, `defaultValue` is returned and `value` is ignored. If
 * `value` is `null` or `undefined`, `defaultValue` is passed to
 * `schema.safeParseAsync()`. When `defaultValue` is omitted, an empty object is
 * used. Validation failures are formatted with {@link formatSchemaError}.
 *
 * @template TSchema - Zod schema type used for parsing.
 * @template TFallback - Fallback type used when no schema is provided.
 * @param {ParseSchemaValueOptions<TSchema, TFallback>} options - Parsing options including the optional schema, raw value, and error formatting.
 * @returns {Promise<SchemaOutput<TSchema, TFallback>>} Parsed (and validated) value matching the schema or fallback type.
 * @throws {Error} If the schema validation fails, using the provided `createError` factory or a plain `Error`.
 *
 * @example
 * ```ts
 * import { parseSchemaValue } from '@faasjs/node-utils'
 * import { z } from '@faasjs/utils'
 *
 * const params = await parseSchemaValue({
 *   schema: z.object({
 *     page: z.coerce.number().default(1),
 *   }),
 *   value: { page: '2' },
 *   errorMessage: 'Invalid params',
 * })
 * ```
 */
export async function parseSchemaValue<
  TSchema extends ZodType | undefined = undefined,
  TFallback = Record<string, never>,
>(options: ParseSchemaValueOptions<TSchema, TFallback>): Promise<SchemaOutput<TSchema, TFallback>> {
  const defaultValue = (
    Object.hasOwn(options, 'defaultValue') ? options.defaultValue : {}
  ) as TFallback

  if (!options.schema) return defaultValue as SchemaOutput<TSchema, TFallback>

  const result = await options.schema.safeParseAsync(options.value ?? defaultValue)

  if (!result.success) {
    const message = formatSchemaError(result.error, options.errorMessage)
    const createError = options.createError || ((text: string) => Error(text))

    throw createError(message)
  }

  return result.data as SchemaOutput<TSchema, TFallback>
}
