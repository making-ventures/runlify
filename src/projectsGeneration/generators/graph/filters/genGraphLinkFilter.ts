import { GraphQLBoolean, GraphQLList, GraphQLType } from 'graphql'
import { LinkField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'

export const genGraphLinkFilter = (
  field: LinkField
): Record<string, { type: GraphQLType }> => {
  let fields = {
    [field.name]: {
      type: fieldTypeToGraphScalar(field),
    },
    [`${field.name}_in`]: {
      type: new GraphQLList(fieldTypeToGraphScalar(field)),
    },
  }

  if (!field.required) {
    fields = {
      ...fields,
      [`${field.name}_defined`]: {
        type: GraphQLBoolean,
      },
    }
  }

  return fields
}
