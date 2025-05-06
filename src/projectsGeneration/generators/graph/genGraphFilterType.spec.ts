import { expect } from 'jest-without-globals'
import { printGraphType } from './printGraphType'
import CatalogBuilder from '../../builders/CatalogBuilder'
import { genGraphFilterType } from './genGraphFilterType'

// yarn test --testPathPattern genGraphFilterType

describe('genGraphFilterType', () => {
  test('simple', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('registered').setType('datetime').setRequired()
    cards.addLinkField('boxes', 'boxId').setType('int').setRequired()
    cards.addField('active').setType('bool')

    expect(printGraphType(genGraphFilterType(cards.build())))
      .toBe(`input CardFilter {
  q: String
  ids: [Int]
  id: Int
  name: String
  name_in: [String]
  name_not_in: [String]
  lastDigits: Int
  lastDigits_in: [Int]
  lastDigits_not_in: [Int]
  lastDigits_lte: Int
  lastDigits_gte: Int
  lastDigits_lt: Int
  lastDigits_gt: Int
  registered: DateTime
  registered_lte: DateTime
  registered_gte: DateTime
  registered_lt: DateTime
  registered_gt: DateTime
  boxId: Int
  boxId_in: [Int]
  boxId_not_in: [Int]
  active: Boolean
  active_defined: Boolean
}

"""
A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
"""
scalar DateTime`)
  })

  test('bigint id', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('registered').setType('datetime').setRequired()
    cards.addLinkField('boxes', 'boxId').setType('bigint').setRequired()
    cards.addField('active').setType('bool')

    expect(printGraphType(genGraphFilterType(cards.build())))
      .toBe(`input CardFilter {
  q: String
  ids: [BigInt]
  id: BigInt
  name: String
  name_in: [String]
  name_not_in: [String]
  lastDigits: Int
  lastDigits_in: [Int]
  lastDigits_not_in: [Int]
  lastDigits_lte: Int
  lastDigits_gte: Int
  lastDigits_lt: Int
  lastDigits_gt: Int
  registered: DateTime
  registered_lte: DateTime
  registered_gte: DateTime
  registered_lt: DateTime
  registered_gt: DateTime
  boxId: BigInt
  boxId_in: [BigInt]
  boxId_not_in: [BigInt]
  active: Boolean
  active_defined: Boolean
}

"""
The \`BigInt\` scalar type represents non-fractional signed whole numeric values.
"""
scalar BigInt

"""
A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
"""
scalar DateTime`)
  })
})
