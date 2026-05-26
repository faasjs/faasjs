/**
 * A normalized YAML line after preprocessing.
 */
export type ParsedLine = {
  /** Line content with indentation and inline comments removed. */
  content: string
  /** Number of leading space characters. */
  indent: number
  /** 1-indexed line number in the original source. */
  line: number
}

/**
 * Result of parsing a YAML node (mapping, sequence, or scalar).
 */
export type ParseResult = {
  /** Parsed JavaScript value. */
  value: unknown
  /** Index into the lines array of the next unparsed line. */
  nextIndex: number
}

/**
 * Per-document parse context holding resolved anchor values.
 */
export type ParseContext = {
  /** Map of anchor name to resolved value. */
  anchors: Map<string, unknown>
}

/**
 * A parsed value token from a mapping entry or sequence item.
 *
 * Discriminated union based on `kind`:
 * - `nested`: Anchor-only line, value comes from the next indented block.
 * - `inline`: Plain scalar value parsed inline.
 * - `alias`: Alias resolved from a previously stored anchor.
 */
export type ParsedValueToken =
  | {
      anchorName: string | undefined
      kind: 'nested'
    }
  | {
      anchorName: string | undefined
      kind: 'inline'
      raw: string
    }
  | {
      anchorName: string | undefined
      kind: 'alias'
      value: unknown
    }
