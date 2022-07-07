/* eslint-disable no-tabs */
import { expect } from 'jest-without-globals'
import { genPrismaFieldFromExternalEntity } from './genPrismaFieldFromExternalEntity'

// yarn test --testPathPattern genPrismaFieldFromExternalEntity

describe('genPrismaFieldFromExternalEntity', () => {
  test('requiered', () => {
    expect(
      genPrismaFieldFromExternalEntity({
        type: 'oneToMany',
        entityOwnerName: 'cards',
        fromField: {
          name: 'userId',
          title: { ru: '' },
          needFor: '',
          updatable: true,
          required: false,
          requiredOnInput: true,
          updatableByUser: true,
          showInList: true,
          showInCreate: true,
          showInEdit: true,
          externalEntity: '',
          category: 'link',
          type: 'string',
          linkCategory: 'entity',
          defaultDbValue: undefined,
          predefinedLinkedEntity: 'none',
        },
        externalEntityName: 'users',
      })
    ).toEqual(
      '  cardUsers	Card[]	@relation("From-Card.user")'.replace(/\s+/gu, '\t')
    )
  })
})
