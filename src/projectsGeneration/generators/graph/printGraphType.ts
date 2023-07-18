import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
  printSchema,
} from 'graphql'

export const printGraphType = (
  sch: GraphQLObjectType | GraphQLInputObjectType
): string =>
  printSchema(
    new GraphQLSchema({
      types: [sch],
    })
  )
