export interface FlatDoc {
  blocks: FlatDocBlock[]
}

export interface FlatDocHeaderBlock {
  type: 'header'
  size: number
  title: string
}

export interface FlatDocParagraphBlock {
  type: 'paragraph'
  text: string
}

export interface FlatDocListElement {
  type: 'orderedListElement'
  text: string
  number: number
  depth: number
  path: string
}

export type FlatDocBlock =
  | FlatDocHeaderBlock
  | FlatDocParagraphBlock
  | FlatDocListElement
