import { GraphQLBoolean, GraphQLList, GraphQLType } from 'graphql'
import { ScalarField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'

export const genGraphScalarFilter = (
  field: ScalarField
): Record<string, { type: GraphQLType }> => {
  let fields = {}

  fields = {
    ...fields,
    [field.name]: {
      type: fieldTypeToGraphScalar(field),
    },
  }

  if (['string', 'int', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_in`]: {
        type: new GraphQLList(fieldTypeToGraphScalar(field)),
      },
    }
  }

  if (['datetime', 'date', 'int', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_lte`]: {
        type: fieldTypeToGraphScalar(field),
      },
      [`${field.name}_gte`]: {
        type: fieldTypeToGraphScalar(field),
      },
      [`${field.name}_lt`]: {
        type: fieldTypeToGraphScalar(field),
      },
      [`${field.name}_gt`]: {
        type: fieldTypeToGraphScalar(field),
      },
    }
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
