import { expect } from 'jest-without-globals'
import CatalogBuilder from '../builders/CatalogBuilder'
import { getLinksToExternalEntities } from './getLinksToExternalEntities'
import {baseField} from '../dataForTests';

// yarn test --testPathPattern getLinksToExternalEntities

describe('getLinksToExternalEntities', () => {
  test('two linked entities', () => {
    const firstEntities = new CatalogBuilder('firstEntities', 'ru')

    expect(
      getLinksToExternalEntities(firstEntities.build(), [
        {
          externalEntityName: 'secondEntities',
          fromField: {
            ...baseField,
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
            showInShow: true,
            showInFilter: true,
            externalEntity: '',
            category: 'link',
            type: 'string',
            linkCategory: 'entity',
            defaultDbValue: undefined,
            predefinedLinkedEntity: 'none',
            filters: [],
          },
          entityOwnerName: 'firstEntities',
          type: 'oneToMany',
        },
        {
          externalEntityName: 'firstEntities',
          fromField: {
            ...baseField,
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
            showInShow: true,
            showInFilter: true,
            externalEntity: '',
            category: 'link',
            type: 'string',
            linkCategory: 'entity',
            defaultDbValue: undefined,
            predefinedLinkedEntity: 'none',
            filters: [],
          },
          entityOwnerName: 'secondEntities',
          type: 'oneToMany',
        },
      ])
    ).toEqual([
      {
        externalEntityName: 'secondEntities',
        fromField: {
          ...baseField,
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
          showInShow: true,
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
