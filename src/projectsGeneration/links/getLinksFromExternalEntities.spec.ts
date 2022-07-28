import { expect } from 'jest-without-globals'
import CatalogBuilder from '../builders/CatalogBuilder'
import { getLinksFromExternalEntities } from './getLinksFromExternalEntities'

// yarn test --testPathPattern getLinksFromExternalEntities

describe('getLinksFromExternalEntities', () => {
  test('two linked entities', () => {
    const firstEntities = new CatalogBuilder('firstEntities', 'ru')

    expect(
      getLinksFromExternalEntities(firstEntities.build(), [
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
            showInWidget: true,
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
            showInWidget: true,
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
          showInWidget: true,
          externalEntity: '',
          category: 'link',
          type: 'string',
          linkCategory: 'entity',
          predefinedLinkedEntity: 'none',
        },
        entityOwnerName: 'secondEntities',
        type: 'oneToMany',
      },
    ])
  })
})
