import { GraphQLNonNull } from 'graphql'
import { IdField } from '../../../builders/buildedTypes'
import { genGraphIdFieldType } from './genGraphIdFieldType'

export const genGraphIdField = (field: IdField) => {
  return {
    [field.name]: {
      required: field.required,
      type: new GraphQLNonNull(genGraphIdFieldType(field)),
    },
  }
}
