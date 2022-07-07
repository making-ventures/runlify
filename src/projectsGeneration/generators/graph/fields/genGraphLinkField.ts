import { GraphQLNonNull } from 'graphql'
import { LinkField } from '../../../builders/buildedTypes'
import { fieldTypeToGraphScalar } from '../fieldTypeToGraphScalar'
import { GraphFieldPurpose } from './genGraphField'

export const genGraphLinkField = (
  field: LinkField,
  purpose: GraphFieldPurpose
) => {
  // return {
  //   [field.name]: {
  //     type: field.requiredOnInput ?
  //       new GraphQLNonNull(fieldTypeToGraphScalar(field.type)) :
  //       fieldTypeToGraphScalar(field.type),
  //   },
  // };
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
