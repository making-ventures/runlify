import { expect } from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import { getCompNamesToShowLinkField } from './getCompNamesToShowLinkField'

describe('getCompNamesToShowLinkField', () => {
  it('generates ReferenceField for link to entity with int id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })

  it('generates ReferenceField for link to entity with string id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })

  it('generates ReferenceField for link to entity with int id and string title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('string')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })

  it('generates ReferenceField for link to entity with string id and string title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('string')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })

  it('generates ReferenceField for link to entity with int id and int title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('int')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })

  it('generates ReferenceField for link to entity with string id and int title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('int')

    expect(getCompNamesToShowLinkField()).toEqual(['ReferenceField'])
  })
})
