/* eslint-disable no-tabs */
import { expect } from 'jest-without-globals'
import CatalogBuilder from '../../../builders/CatalogBuilder'
import { genPrismaEntity } from './genPrismaEntity'
import {baseField} from '../../../dataForTests';

// yarn test --testPathPattern genPrismaEntity
// yarn test --testPathPattern genPrismaEntity -t 'with true default db field'

describe('genPrismaEntity', () => {
  test('simple', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
}
`)
  })

  test('with string id', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	String	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
}
`)
  })

  test('with links to external entities with id postfix on field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addLinkField('users', 'userId').setType('int').setRequired()

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
	userId	Int
	user	User	@relation("From-Card.user", fields: [userId], references: [id])
}
`)
  })

  test('with links to external entities with bigint id postfix on field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addLinkField('users', 'userId').setType('bigint').setRequired()

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
	userId	BigInt
	user	User	@relation("From-Card.user", fields: [userId], references: [id])
}
`)
  })

  test('with links to external entities without id postfix on field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addLinkField('users', 'userId').setType('int').setRequired()

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
	userId	Int
	user	User	@relation("From-Card.user", fields: [userId], references: [id])
}
`)
  })

  test('with links from external entities', () => {
    const users = new CatalogBuilder('users', 'ru')

    expect(
      genPrismaEntity(users.build(), [
        {
          type: 'oneToMany',
          entityOwnerName: 'cards',
          fromField: {
            ...baseField,
            externalEntity: '',
            category: 'link',
            type: 'string',
            linkCategory: 'entity',
            predefinedLinkedEntity: 'none',
          },
          externalEntityName: 'users',
        },
      ])
    ).toBe(`model User {
	id	Int	@default(autoincrement())	@id
	search	String?
	cardUsers	Card[]	@relation("From-Card.user")
}
`)
  })

  test('with unique constraints', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addUniqueConstraint(['lastDigits', 'active'])

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
	@@unique([lastDigits, active])
}
`)
  })

  test('with true default db field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool').setDefaultDbValue(true)

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?	@default(true)
}
`)
  })
})
