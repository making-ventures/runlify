import { expect } from 'jest-without-globals'
import CatalogBuilder from '../builders/CatalogBuilder'
import { getLinksOfEntities } from './getLinksOfEntities'

// yarn test --testPathPattern getLinksOfEntities

describe('getLinksOfEntities', () => {
  test('without links', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('name').setType('string').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    expect(getLinksOfEntities([cards.build()])).toEqual([])
  })

  test('one entity with one link', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addLinkField('someEntity', 'someId').setType('bigint').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    expect(getLinksOfEntities([cards.build()])).toEqual([
      {
        entityOwnerName: 'cards',
        externalEntityName: 'someEntity',
        fromField: {
          category: 'link',
          defaultBackendValueExpression: undefined,
          defaultDbValue: undefined,
          defaultValueExpression: undefined,
          externalEntity: 'someEntity',
          hidden: false,
          linkCategory: 'entity',
          name: 'someId',
          needFor: '',
          required: true,
          requiredOnInput: true,
          searchable: true,
          showInCreate: true,
          showInEdit: true,
          showInShow: true,
          showInList: true,
          showInFilter: true,
          title: {
            ru: 'Some',
          },
          type: 'bigint',
          updatable: true,
          updatableByUser: true,
          predefinedLinkedEntity: 'none',
        },
        type: 'oneToMany',
      },
    ])
  })

  test('one entity with two links', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addLinkField('someEntity', 'someId').setType('bigint').setRequired()
    cards.addLinkField('someEntity2', 'some2Id').setType('bigint').setRequired()
    cards.addField('lastDigits').setType('int').setRequired()
    cards.addField('active').setType('bool')
    expect(getLinksOfEntities([cards.build()])).toEqual([
      {
        entityOwnerName: 'cards',
        externalEntityName: 'someEntity',
        fromField: {
          category: 'link',
          defaultBackendValueExpression: undefined,
          defaultDbValue: undefined,
          defaultValueExpression: undefined,
          hidden: false,
          externalEntity: 'someEntity',
          linkCategory: 'entity',
          name: 'someId',
          needFor: '',
          required: true,
          requiredOnInput: true,
          searchable: true,
          showInCreate: true,
          showInEdit: true,
          showInShow: true,
          showInList: true,
          showInFilter: true,
          title: {
            ru: 'Some',
          },
          type: 'bigint',
          updatable: true,
          updatableByUser: true,
          predefinedLinkedEntity: 'none',
        },
        type: 'oneToMany',
      },
      {
        entityOwnerName: 'cards',
        externalEntityName: 'someEntity2',
        fromField: {
          category: 'link',
          defaultBackendValueExpression: undefined,
          defaultDbValue: undefined,
          defaultValueExpression: undefined,
          externalEntity: 'someEntity2',
          hidden: false,
          linkCategory: 'entity',
          name: 'some2Id',
          needFor: '',
          required: true,
          requiredOnInput: true,
          searchable: true,
          showInCreate: true,
          showInEdit: true,
          showInShow: true,
          showInList: true,
          showInFilter: true,
          title: {
            ru: 'Some2',
          },
          type: 'bigint',
          updatable: true,
          updatableByUser: true,
          predefinedLinkedEntity: 'none',
        },
        type: 'oneToMany',
      },
    ])
  })

  test('two linked entities', () => {
    const firstEntities = new CatalogBuilder('firstEntities', 'ru')
    firstEntities
      .addLinkField('secondEntities', 'secondEntityId')
      .setType('bigint')
      .setRequired()
    firstEntities.addField('lastDigits').setType('int').setRequired()
    firstEntities.addField('active').setType('bool')

    const secondEntities = new CatalogBuilder('secondEntities', 'ru')
    secondEntities
      .addLinkField('firstEntities', 'firstEntityId')
      .setType('bigint')
      .setRequired()
    secondEntities.addField('lastDigits').setType('int').setRequired()
    secondEntities.addField('active').setType('bool')

    expect(
      getLinksOfEntities([firstEntities.build(), secondEntities.build()])
    ).toEqual([
      {
        entityOwnerName: 'firstEntities',
        externalEntityName: 'secondEntities',
        fromField: {
          category: 'link',
          defaultBackendValueExpression: undefined,
          defaultDbValue: undefined,
          defaultValueExpression: undefined,
          externalEntity: 'secondEntities',
          hidden: false,
          linkCategory: 'entity',
          name: 'secondEntityId',
          needFor: '',
          required: true,
          requiredOnInput: true,
          searchable: true,
          showInCreate: true,
          showInEdit: true,
          showInShow: true,
          showInList: true,
          showInFilter: true,
          title: {
            ru: 'Second entity',
          },
          type: 'bigint',
          updatable: true,
          updatableByUser: true,
          predefinedLinkedEntity: 'none',
        },
        type: 'oneToMany',
      },
      {
        entityOwnerName: 'secondEntities',
        externalEntityName: 'firstEntities',
        fromField: {
          category: 'link',
          defaultBackendValueExpression: undefined,
          defaultDbValue: undefined,
          defaultValueExpression: undefined,
          externalEntity: 'firstEntities',
          hidden: false,
          linkCategory: 'entity',
          name: 'firstEntityId',
          needFor: '',
          required: true,
          requiredOnInput: true,
          searchable: true,
          showInCreate: true,
          showInEdit: true,
          showInShow: true,
          showInList: true,
          showInFilter: true,
          title: {
            ru: 'First entity',
          },
          type: 'bigint',
          updatable: true,
          updatableByUser: true,
          predefinedLinkedEntity: 'none',
        },
        type: 'oneToMany',
      },
    ])
  })
})
