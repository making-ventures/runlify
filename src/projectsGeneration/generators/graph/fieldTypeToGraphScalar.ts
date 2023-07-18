import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from 'graphql'
import { GraphQLDateTime, GraphQLDate, GraphQLBigInt, GraphQLJSON } from 'graphql-scalars'
import { Field } from '../../builders/buildedTypes'

export const fieldTypeToGraphScalar = (field: Field) => {
  switch (field.type) {
    case 'int':
      return GraphQLInt
    case 'bigint':
      return GraphQLBigInt
    case 'float':
      return GraphQLFloat
    case 'string':
      if ('stringType' in field && field.stringType == 'json') {
        return GraphQLJSON
      }
      return GraphQLString
    case 'bool':
      return GraphQLBoolean
    case 'datetime':
      return GraphQLDateTime
    case 'date':
      return GraphQLDate
    default:
      throw new Error(`Unexpected "${(field as any).type}" type`)
  }
}
