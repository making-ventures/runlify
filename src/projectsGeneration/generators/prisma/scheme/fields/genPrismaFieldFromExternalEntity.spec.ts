/* eslint-disable no-tabs */
import { expect } from 'jest-without-globals'
import { genPrismaFieldFromExternalEntity } from './genPrismaFieldFromExternalEntity'
import {baseField} from '../../../../dataForTests';

// yarn test --testPathPattern genPrismaFieldFromExternalEntity

describe('genPrismaFieldFromExternalEntity', () => {
  test('requiered', () => {
    expect(
      genPrismaFieldFromExternalEntity({
        type: 'oneToMany',
        entityOwnerName: 'cards',
        fromField: {
          ...baseField,
          externalEntity: '',
          category: 'link',
          type: 'string',
          linkCategory: 'entity',
          predefinedLinkedEntity: 'none',
        },
        externalEntityName: 'users',
      })
    ).toEqual(
      '  cardUsers	Card[]	@relation("From-Card.user")'.replaceAll(/\s+/gu, '\t')
    )
  })
})
