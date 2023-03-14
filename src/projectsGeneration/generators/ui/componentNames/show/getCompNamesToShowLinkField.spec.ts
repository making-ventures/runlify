import { expect } from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import { getCompNamesToShowLinkField } from './getCompNamesToShowLinkField'
import {baseField} from '../../../../dataForTests';

describe('getCompNamesToShowLinkField', () => {
  it('generates NumberField and ReferenceField for link to entity with int id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'bigint',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['NumberField', 'ReferenceField'])
  })

  it('generates TextField and ReferenceField for link to entity with string id which is also title field', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'string',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['TextField', 'ReferenceField'])
  })

  it('generates TextField, ReferenceField for link to entity with int id and string title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('string')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'bigint',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['TextField', 'ReferenceField'])
  })

  it('generates TextField, ReferenceField for link to entity with string id and string title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('string')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'string',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['TextField', 'ReferenceField'])
  })

  it('generates NumberField, ReferenceField for link to entity with int id and int title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('int')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'bigint',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['NumberField', 'ReferenceField'])
  })

  it('generates NumberField, ReferenceField for link to entity with string id and int title', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards
      .addField('someField', undefined, { isTitleField: true })
      .setType('int')

    expect(
      getCompNamesToShowLinkField(
        {
          ...baseField,
          category: 'link',
          needFor: 'notSet',
          externalEntity: 'cards',
          name: 'someField',
          required: true,
          requiredOnInput: true,
          type: 'string',
          updatable: true,
          updatableByUser: false,
          title: { ru: 'title' },
          showInCreate: true,
          showInEdit: true,
          showInList: true,
          showInFilter: true,
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        new Map([['cards', cards.build()]])
      )
    ).toEqual(['NumberField', 'ReferenceField'])
  })
})
