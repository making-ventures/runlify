import { Field, TsModelField } from '../../../builders/buildedTypes'
import { genGraphIdField } from './genGraphIdField'
import { genGraphLinkField } from './genGraphLinkField'
import { genGraphScalarField } from './genGraphScalarField'

export type GraphFieldPurpose = 'entity' | 'mutation'

export const genGraphField = (field: Field | TsModelField, purpose: GraphFieldPurpose) => {
  const { category } = field
  switch (category) {
    case 'id':
      return genGraphIdField(field)
    case 'link':
      return genGraphLinkField(field, purpose)
    case 'scalar':
      return genGraphScalarField(field, purpose)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
