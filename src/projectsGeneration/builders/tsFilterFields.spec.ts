import {expect} from 'jest-without-globals'
import CatalogBuilder from './CatalogBuilder'
import {tsFilterFields} from './tsFilterFields'

// yarn test --testPathPattern tsFilterFields

describe('tsFilterFields', () => {
  test('works', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addField('created').setType('datetime')

    expect(tsFilterFields(cards)).toBe(`q: string;
id: number;
name: string;
lastDigits: number;
active: boolean;
created: Date;
created_lte: Date;
created_gte: Date;
created_lt: Date;
created_gt: Date;`)
  })

  test('bigint id', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addField('created').setType('datetime')

    expect(tsFilterFields(cards)).toBe(`q: string;
id: bigint;
name: string;
lastDigits: number;
active: boolean;
created: Date;
created_lte: Date;
created_gte: Date;
created_lt: Date;
created_gt: Date;`)
  })
})
