import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { expect } from 'jest-without-globals'
import { printGraphType } from './printGraphType'

// yarn test --testPathPattern printGraphType

test('printGraphType', () => {
  expect(
    printGraphType(
      new GraphQLObjectType({
        fields: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          lastDigits: { type: GraphQLInt },
          active: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
        name: 'Card',
      })
    )
  ).toBe(`type Card {
  id: ID!
  name: String
  lastDigits: Int
  active: Boolean!
}`)
})
