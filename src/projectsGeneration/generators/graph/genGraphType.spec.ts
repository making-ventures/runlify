import { expect } from 'jest-without-globals'
import { printGraphType } from './printGraphType'
import CatalogBuilder from '../../builders/CatalogBuilder'
import { genGraphType } from './genGraphType'

// yarn test --testPathPattern genGraphType

describe('genGraphType', () => {
  test('simple', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')

    expect(printGraphType(genGraphType(cards.build()))).toBe(`type Card {
  id: Int!
  name: String!
  lastDigits: Int!
  active: Boolean
}`)
  })

  test('bigInt id', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')

    expect(printGraphType(genGraphType(cards.build()))).toBe(`type Card {
  id: BigInt!
  name: String!
  lastDigits: Int!
  active: Boolean
}

"""
The \`BigInt\` scalar type represents non-fractional signed whole numeric values.
"""
scalar BigInt`)
  })
})
