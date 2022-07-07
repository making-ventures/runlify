import { GraphQLList, GraphQLType } from 'graphql'
import { ScalarField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'

export const genGraphScalarFilter = (
  field: ScalarField
): Record<string, { type: GraphQLType }> => {
  let fields = {}

  fields = {
    ...fields,
    [field.name]: {
      type: fieldTypeToGraphScalar(field.type),
    },
  }

  if (['string', 'int', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_in`]: {
        type: new GraphQLList(fieldTypeToGraphScalar(field.type)),
      },
    }
  }

  if (['datetime', 'date', 'int', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_lte`]: {
        type: fieldTypeToGraphScalar(field.type),
      },
      [`${field.name}_gte`]: {
        type: fieldTypeToGraphScalar(field.type),
      },
      [`${field.name}_lt`]: {
        type: fieldTypeToGraphScalar(field.type),
      },
      [`${field.name}_gt`]: {
        type: fieldTypeToGraphScalar(field.type),
      },
    }
  }

  return fields
}
