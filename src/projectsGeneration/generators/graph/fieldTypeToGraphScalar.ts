import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from 'graphql'
import { GraphQLDateTime, GraphQLDate, GraphQLBigInt } from 'graphql-scalars'
import { FiledType } from '../../builders/buildedTypes'

export const fieldTypeToGraphScalar = (type: FiledType) => {
  switch (type) {
    case 'int':
      return GraphQLInt
    case 'bigint':
      return GraphQLBigInt
    case 'float':
      return GraphQLFloat
    case 'string':
      return GraphQLString
    case 'bool':
      return GraphQLBoolean
    case 'datetime':
      return GraphQLDateTime
    case 'date':
      return GraphQLDate
    default:
      throw new Error(`Unexpected "${type}" type`)
  }
}
