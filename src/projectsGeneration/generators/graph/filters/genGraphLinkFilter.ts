import { GraphQLList, GraphQLType } from 'graphql'
import { LinkField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'

export const genGraphLinkFilter = (
  field: LinkField
): Record<string, { type: GraphQLType }> => {
  return {
    [field.name]: {
      type: fieldTypeToGraphScalar(field),
    },
    [`${field.name}_in`]: {
      type: new GraphQLList(fieldTypeToGraphScalar(field)),
    },
  }
}
