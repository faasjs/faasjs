export type ParsedLine = {
  content: string
  indent: number
  line: number
}

export type ParseResult = {
  value: unknown
  nextIndex: number
}

export type ParseContext = {
  anchors: Map<string, unknown>
}

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
