import {FlatDoc, FlatDocBlock} from './flatDoc'

const handleDocBlock = (block: FlatDocBlock): string => {
  switch (block.type) {
    case 'header':
      return block.title
    case 'paragraph':
      return block.text
    case 'orderedListElement':
      return `${'  '.repeat(block.depth - 1)}${block.path}. ${block.text}`
  }
}

const flatDocToText = (doc: FlatDoc): string =>
  doc.blocks.map(handleDocBlock).join('\n\n')

export default flatDocToText
