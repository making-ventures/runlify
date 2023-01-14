import { expect } from 'jest-without-globals'
import { LinkFieldBuilder } from '../../builders/fields/LinkFieldBuilder'
import CatalogBuilder from '../../builders/CatalogBuilder'
import { getLinkShowComponent } from './getShowComponent'

describe('getLinkShowComponent', () => {
  test('string link, title is id of linked entity', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')

    expect(
      getLinkShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new Map([['cards', cards.build()]]),
        new LinkFieldBuilder('cards', 'cardId', 'ru').build()
      )
    )
      .toBe(`<ReferenceField source='cardId' label={translate('catalogs.cards.fields.cardId')} reference='cards' link='show' />`)
  })

  test('int link, title is id of linked entity', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')

    expect(
      getLinkShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new Map([['cards', cards.build()]]),
        new LinkFieldBuilder('cards', 'cardId', 'ru').build()
      )
    )
      .toBe(`<ReferenceField source='cardId' label={translate('catalogs.cards.fields.cardId')} reference='cards' link='show' />`)
  })

  test('string link, title is int field of linked entity', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('int')

    expect(
      getLinkShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new Map([['cards', cards.build()]]),
        new LinkFieldBuilder('cards', 'cardId', 'ru').build()
      )
    )
      .toBe(`<ReferenceField source='cardId' label={translate('catalogs.cards.fields.cardId')} reference='cards' link='show' />`)
  })

  test('int link, title is string field of linked entity', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('string')

    expect(
      getLinkShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new Map([['cards', cards.build()]]),
        new LinkFieldBuilder('cards', 'cardId', 'ru').build()
      )
    )
      .toBe(`<ReferenceField source='cardId' label={translate('catalogs.cards.fields.cardId')} reference='cards' link='show' />`)
  })
})
