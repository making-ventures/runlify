import {GraphQLNamedType} from 'graphql'
import {Field, TsModelField} from '../../../builders/buildedTypes'
import {genGraphIdField} from './genGraphIdField'
import {genGraphLinkField} from './genGraphLinkField'
import {genGraphModelField} from './genGraphModelField'
import {genGraphScalarField} from './genGraphScalarField'

export type GraphFieldPurpose = 'input' | 'result'

export const genGraphField = (
  field: Field | TsModelField,
  purpose: GraphFieldPurpose,
  externalTypes: GraphQLNamedType[] = [],
) => {
  const { category } = field
  switch (category) {
    case 'id':
      return genGraphIdField(field)
    case 'link':
      return genGraphLinkField(field, purpose)
    case 'scalar':
      return genGraphScalarField(field, purpose)
    case 'model':
      return genGraphModelField(field, purpose, externalTypes)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
