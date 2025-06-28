import {GraphQLNamedType, GraphQLNonNull} from 'graphql'
import {ModelField} from '../../../builders/buildedTypes'
import {fieldTypeToGraphScalar} from '../fieldTypeToGraphScalar'
import {GraphFieldPurpose} from './genGraphField'

export const genGraphModelField = (
  field: ModelField,
  purpose: GraphFieldPurpose,
  externalTypes: GraphQLNamedType[],
) => {
  if (purpose === 'input') {
    return {
      [field.name]: {
        type: field.requiredOnInput !== false && field.required
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field, purpose, externalTypes))
          : fieldTypeToGraphScalar(field, purpose),
      },
    }
  } else {
    return {
      [field.name]: {
        type: field.requiredOnInput
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field, purpose, externalTypes))
          : fieldTypeToGraphScalar(field, purpose),
      },
    }
  }
}
