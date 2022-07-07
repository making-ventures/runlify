import { GraphQLID, GraphQLInt } from 'graphql'
import { IdField } from '../../../builders/buildedTypes'
import { GraphQLBigInt } from 'graphql-scalars'

export const genGraphIdFieldType = (field: IdField) => {
  const { type } = field
  switch (type) {
    case 'int':
      return GraphQLInt
    case 'bigint':
      return GraphQLBigInt
    case 'string':
      return GraphQLID
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
