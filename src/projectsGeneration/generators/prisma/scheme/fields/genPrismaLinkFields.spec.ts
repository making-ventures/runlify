import { expect } from 'jest-without-globals'
import LinkFieldBuilder from '../../../../builders/fields/LinkFieldBuilder'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import { genPrismaLinkFields } from './genPrismaLinkFields'

// yarn test --testPathPattern genPrismaLinkFields

describe('genPrismaLinkFields', () => {
  describe('by type', () => {
    test('int', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('bigint')
        .setRequired(true)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	BigInt',
        '	user	User	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })

    test('string', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('string')
        .setRequired(true)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	String',
        '	user	User	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })
  })

  describe('by requirement', () => {
    test('requiered', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('bigint')
        .setRequired(true)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	BigInt',
        '	user	User	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })

    test('not requiered', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('bigint')
        .setRequired(false)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	BigInt?',
        '	user	User?	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })
  })

  describe('by field postfix', () => {
    test('with postfix', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('bigint')
        .setRequired(true)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	BigInt',
        '	user	User	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })

    test('without postfix', () => {
      const cards = new CatalogBuilder('cards', 'ru')
      const someField = new LinkFieldBuilder('user', 'userId', 'ru')
        .setType('bigint')
        .setRequired(true)
        .build()
      expect(genPrismaLinkFields(cards.build(), someField)).toEqual([
        '	userId	BigInt',
        '	user	User	@relation("From-Card.user", fields: [userId], references: [id])',
      ])
    })
  })
})
