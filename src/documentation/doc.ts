export interface Doc {
  rootGroup: DocBlockGroup
}

export interface DocBlockGroup {
  title?: string
  block?: DocBlock
  children: DocBlockGroup[]
}

export interface DocParagraphBlock {
  type: 'paragraph'
  text: string
}

export interface DocListElement {
  text: string
  list?: DocListElement[]
}

export interface DocOrderedListBlock {
  type: 'orderedList'
  list: DocListElement[]
}

export type DocBlock = DocParagraphBlock | DocOrderedListBlock
