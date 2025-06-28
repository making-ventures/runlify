import {GraphQLNonNull} from 'graphql'
import {ScalarField} from '../../../builders/buildedTypes'
import {fieldTypeToGraphScalar} from '../fieldTypeToGraphScalar'
import {GraphFieldPurpose} from './genGraphField'

export const genGraphScalarField = (
  field: ScalarField,
  purpose: GraphFieldPurpose
) => {
  if (purpose === 'input') {
    return {
      [field.name]: {
        type: field.requiredOnInput !== false && field.required
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field, purpose))
          : fieldTypeToGraphScalar(field, purpose),
      },
    }
  } else {
    return {
      [field.name]: {
        type: field.requiredOnInput
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field, purpose))
          : fieldTypeToGraphScalar(field, purpose),
      },
    }
  }
}
