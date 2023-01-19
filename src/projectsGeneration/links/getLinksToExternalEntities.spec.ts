import { expect } from 'jest-without-globals'
import CatalogBuilder from '../builders/CatalogBuilder'
import { getLinksToExternalEntities } from './getLinksToExternalEntities'

// yarn test --testPathPattern getLinksToExternalEntities

describe('getLinksToExternalEntities', () => {
  test('two linked entities', () => {
    const firstEntities = new CatalogBuilder('firstEntities', 'ru')

    expect(
      getLinksToExternalEntities(firstEntities.build(), [
        {
          externalEntityName: 'secondEntities',
          fromField: {
            name: 'secondEntityId',
            title: { ru: '' },
            needFor: '',
            updatable: true,
            required: false,
            requiredOnInput: true,
            updatableByUser: true,
            showInList: true,
            showInCreate: true,
            showInEdit: true,
            showInFilter: true,
            externalEntity: '',
            category: 'link',
            type: 'string',
            linkCategory: 'entity',
            defaultDbValue: undefined,
            predefinedLinkedEntity: 'none',
          },
          entityOwnerName: 'firstEntities',
          type: 'oneToMany',
        },
        {
          externalEntityName: 'firstEntities',
          fromField: {
            name: 'firstEntityId',
            title: { ru: '' },
            needFor: '',
            updatable: true,
            required: false,
            requiredOnInput: true,
            updatableByUser: true,
            showInList: true,
            showInCreate: true,
            showInEdit: true,
            showInFilter: true,
            externalEntity: '',
            category: 'link',
            type: 'string',
            linkCategory: 'entity',
            defaultDbValue: undefined,
            predefinedLinkedEntity: 'none',
          },
          entityOwnerName: 'secondEntities',
          type: 'oneToMany',
        },
      ])
    ).toEqual([
      {
        externalEntityName: 'secondEntities',
        fromField: {
          name: 'secondEntityId',
          title: { ru: '' },
          needFor: '',
          updatable: true,
          required: false,
          requiredOnInput: true,
          updatableByUser: true,
          showInList: true,
          showInCreate: true,
          showInEdit: true,
          showInFilter: true,
          externalEntity: '',
          category: 'link',
          type: 'string',
          linkCategory: 'entity',
          predefinedLinkedEntity: 'none',
        },
        entityOwnerName: 'firstEntities',
        type: 'oneToMany',
      },
    ])
  })
})
