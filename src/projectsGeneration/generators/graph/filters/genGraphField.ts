import {Field} from '../../../builders/buildedTypes'
import {genGraphIdFilter} from './genGraphIdFilter'
import {genGraphLinkFilter} from './genGraphLinkFilter'
import {genGraphScalarFilter} from './genGraphScalarFilter'

export const genGraphFilter = (field: Field) => {
  const { category } = field
  switch (category) {
    case 'id':
      return genGraphIdFilter(field)
    case 'link':
      return genGraphLinkFilter(field)
    case 'scalar':
      return genGraphScalarFilter(field)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
