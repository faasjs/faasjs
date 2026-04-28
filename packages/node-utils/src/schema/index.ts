import type { output, ZodError, ZodType } from 'zod'

/**
 * Parsed value type for an optional Zod schema.
 *
 * When a schema is present, the type is the schema's output type. When the
 * schema is omitted, the caller-provided fallback type is used instead.
 */
export type SchemaOutput<
  TSchema extends ZodType | undefined = undefined,
  TFallback = Record<string, never>,
> = TSchema extends ZodType ? output<NonNullable<TSchema>> : TFallback

/**
 * Options for parsing an unknown value with an optional Zod schema.
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
   * Defaults to an empty object.
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
 * If `schema` is omitted, `defaultValue` is returned. If `value` is `null` or
 * `undefined`, the same `defaultValue` is passed to the schema parser. When
 * `defaultValue` is omitted, an empty object is used.
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
