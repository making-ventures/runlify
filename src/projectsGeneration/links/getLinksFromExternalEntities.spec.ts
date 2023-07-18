import { expect } from 'jest-without-globals'
import CatalogBuilder from '../builders/CatalogBuilder'
import { getLinksFromExternalEntities } from './getLinksFromExternalEntities'
import {baseField} from '../dataForTests';

// yarn test --testPathPattern getLinksFromExternalEntities

describe('getLinksFromExternalEntities', () => {
  test('two linked entities', () => {
    const firstEntities = new CatalogBuilder('firstEntities', 'ru')

    expect(
      getLinksFromExternalEntities(firstEntities.build(), [
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
            showInFilter: true,
            showInShow: true,
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
            showInFilter: true,
            showInShow: true,
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
          showInFilter: true,
          showInShow: true,
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
