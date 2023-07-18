import { expect } from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import { LinkFieldBuilder } from '../../../../builders/fields/LinkFieldBuilder'
import { getCompNamesToEditLinkField } from './getCompNamesToEditLinkField'

describe('getCompNamesToEditLinkField', () => {
  it('generates SelectInput and ReferenceInput for link to entity with int id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('someField').setType('string')

    expect(
      getCompNamesToEditLinkField(
        new LinkFieldBuilder('cards', 'cardId', 'ru').build(),
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['ReferenceInput', 'AutocompleteInput'])
  })

  it('generates AutocompleteInput and ReferenceInput for link to entity with string id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards.addField('someField').setType('string')

    expect(
      getCompNamesToEditLinkField(
        new LinkFieldBuilder('cards', 'cardId', 'ru').build(),
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['ReferenceInput', 'AutocompleteInput'])
  })
})
