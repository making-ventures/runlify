import { GraphQLNonNull } from 'graphql'
import { ScalarField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'
import { GraphFieldPurpose } from './genGraphField'

export const genGraphScalarField = (
  field: ScalarField,
  purpose: GraphFieldPurpose
) => {
  if (purpose === 'entity') {
    return {
      [field.name]: {
        type: field.required
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field.type))
          : fieldTypeToGraphScalar(field.type),
      },
    }
  } else {
    return {
      [field.name]: {
        type: field.requiredOnInput
          ? new GraphQLNonNull(fieldTypeToGraphScalar(field.type))
          : fieldTypeToGraphScalar(field.type),
      },
    }
  }
}
