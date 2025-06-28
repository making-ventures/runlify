import {GraphQLNonNull} from 'graphql'
import {LinkField} from '../../../builders/buildedTypes'
import {fieldTypeToGraphScalar} from '../fieldTypeToGraphScalar'
import {GraphFieldPurpose} from './genGraphField'

export const genGraphLinkField = (
  field: LinkField,
  purpose: GraphFieldPurpose,
) => {
  if (purpose === 'input') {
    return {
      [field.name]: {
        type: field.required
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
