import { GraphQLList, GraphQLType } from 'graphql'
import { IdField } from '../../../builders/buildedTypes'
import { camelPlural } from '../../../../utils/cases'
import { genGraphIdFieldType } from '../fields/genGraphIdFieldType'

export const genGraphIdFilter = (
  field: IdField
): Record<string, { type: GraphQLType }> => {
  return {
    [field.name]: {
      type: genGraphIdFieldType(field),
    },
  }
}

export const genGraphIdPluralFilter = (
  field: IdField
): Record<string, { type: GraphQLType }> => {
  return {
    [camelPlural(field.name)]: {
      type: new GraphQLList(genGraphIdFieldType(field)),
    },
  }
}
