import { expect } from 'jest-without-globals'
import CatalogBuilder from '../../builders/CatalogBuilder'
import { ScalarFieldBuilder } from '../../builders/fields/ScalarFieldBuilder'
import { getScalarShowComponent } from './getShowComponent'

describe('getScalarShowComponent', () => {
  test('string', () => {
    expect(
      getScalarShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new ScalarFieldBuilder('someField', 'ru').setType('string').build()
      )
    ).toBe(
      "<TextField source='someField' label='catalogs.cards.fields.someField' />"
    )
  })

  test('int', () => {
    expect(
      getScalarShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new ScalarFieldBuilder('someField', 'ru').setType('int').build()
      )
    ).toBe(
      "<NumberField source='someField' label='catalogs.cards.fields.someField' />"
    )
  })

  test('float', () => {
    expect(
      getScalarShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new ScalarFieldBuilder('someField', 'ru').setType('float').build()
      )
    ).toBe(
      "<NumberField source='someField' label='catalogs.cards.fields.someField' />"
    )
  })

  test('bool', () => {
    expect(
      getScalarShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new ScalarFieldBuilder('someField', 'ru').setType('bool').build()
      )
    ).toBe(
      "<BooleanField source='someField' label='catalogs.cards.fields.someField' />"
    )
  })

  test('datetime', () => {
    expect(
      getScalarShowComponent(
        new CatalogBuilder('cards', 'ru').build(),
        new ScalarFieldBuilder('someField', 'ru').setType('datetime').build()
      )
    ).toBe(
      "<DateField source='someField' label='catalogs.cards.fields.someField' showTime />"
    )
  })
})
