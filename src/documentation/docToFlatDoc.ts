import { Doc, DocBlock, DocBlockGroup, DocListElement } from './doc'
import { FlatDoc } from './flatDoc'

const handleDocListElement = (
  flatDoc: FlatDoc,
  block: DocListElement,
  number: number,
  depth: number,
  pathBase: string
) => {
  const path = pathBase ? `${pathBase}.${number}` : number.toString()
  flatDoc.blocks.push({
    type: 'orderedListElement',
    number,
    depth,
    text: block.text,
    path,
  })

  if (block.list) {
    block.list.forEach((el, index) =>
      handleDocListElement(flatDoc, el, index + 1, depth + 1, path)
    )
  }
}

const handleDocBlock = (flatDoc: FlatDoc, block: DocBlock) => {
  switch (block.type) {
    case 'paragraph':
      flatDoc.blocks.push({
        type: 'paragraph',
        text: block.text,
      })
      break
    case 'orderedList':
      block.list.forEach((el, index) =>
        handleDocListElement(flatDoc, el, index + 1, 1, '')
      )
      break

    // default:
    //   throw new Error(`Unknown "${block.type}" type`);
  }
}

const handleDocBlockGroup = (
  flatDoc: FlatDoc,
  level: number,
  group: DocBlockGroup
) => {
  if (group.title) {
    flatDoc.blocks.push({
      type: 'header',
      title: group.title,
      size: level,
    })
  }
  if (group.block) {
    handleDocBlock(flatDoc, group.block)
  }
  group.children.forEach((c) => handleDocBlockGroup(flatDoc, level + 1, c))
}

const docToFlatDoc = (doc: Doc): FlatDoc => {
  const flatDoc: FlatDoc = { blocks: [] }

  handleDocBlockGroup(flatDoc, 1, doc.rootGroup)

  return flatDoc
}

export default docToFlatDoc
