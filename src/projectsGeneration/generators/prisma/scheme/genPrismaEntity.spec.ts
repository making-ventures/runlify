import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../builders/CatalogBuilder'
import {genPrismaEntity} from './genPrismaEntity'
import {baseField} from '../../../dataForTests';
import {IndexType, StringType} from '../../../builders';

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
            filters: [],
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

  test('with indexes', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    cards.addIndex({fields: ['lastDigits', 'active'], type: IndexType.BTree});

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	lastDigits	Int
	active	Boolean?
	@@index([lastDigits, active], type: BTree)
}
`)
  })

  test('with Gin index on Json (auto JsonbPathOps)', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('meta').setType('string').setStringType(StringType.Json).setRequired()
    cards.addIndex({
      fields: ['meta'],
      type: IndexType.Gin,
    })

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	meta	Json
	@@index([meta(ops: JsonbPathOps)], type: Gin)
}
`)
  })

  test('with Gin index on non-Json field (no ops)', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('tags').setType('string').setRequired()
    cards.addIndex({fields: ['tags'], type: IndexType.Gin})

    expect(genPrismaEntity(cards.build(), [])).toBe(`model Card {
	id	Int	@default(autoincrement())	@id
	search	String?
	name	String
	tags	String
	@@index([tags], type: Gin)
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
