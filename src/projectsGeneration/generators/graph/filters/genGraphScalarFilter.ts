import {GraphQLBoolean, GraphQLList, GraphQLType} from 'graphql'
import {ScalarField} from '../../../builders/buildedTypes'
import {fieldTypeToGraphScalar} from '../fieldTypeToGraphScalar'

export const genGraphScalarFilter = (
  field: ScalarField
): Record<string, { type: GraphQLType }> => {
  let fields = {}

  fields = {
    ...fields,
    [field.name]: {
      type: fieldTypeToGraphScalar(field, 'input'),
    },
  }

  if (['string', 'int', 'bigint', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_in`]: {
        type: new GraphQLList(fieldTypeToGraphScalar(field, 'input')),
      },
      [`${field.name}_not_in`]: {
        type: new GraphQLList(fieldTypeToGraphScalar(field, 'input')),
      },
    }
  }

  if (['datetime', 'date', 'int', 'bigint', 'float'].includes(field.type)) {
    fields = {
      ...fields,
      [`${field.name}_lte`]: {
        type: fieldTypeToGraphScalar(field, 'input'),
      },
      [`${field.name}_gte`]: {
        type: fieldTypeToGraphScalar(field, 'input'),
      },
      [`${field.name}_lt`]: {
        type: fieldTypeToGraphScalar(field, 'input'),
      },
      [`${field.name}_gt`]: {
        type: fieldTypeToGraphScalar(field, 'input'),
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
