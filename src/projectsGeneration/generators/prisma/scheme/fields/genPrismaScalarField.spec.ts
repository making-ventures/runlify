/* eslint-disable no-tabs */
import { expect } from 'jest-without-globals'
import { ScalarFieldBuilder } from '../../../../builders/fields/ScalarFieldBuilder'
import { genPrismaScalarField } from './genPrismaScalarField'

// yarn test --testPathPattern genPrismaScalarField

describe('genPrismaScalarField', () => {
  test('int optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('int')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Int?'.replace(/\s+/gu, '\t'),
    ])
  })
  test('int required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('int')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Int'.replace(/\s+/gu, '\t'),
    ])
  })

  // string
  test('string optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('string')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	String?'.replace(/\s+/gu, '\t'),
    ])
  })
  test('string required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('string')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	String'.replace(/\s+/gu, '\t'),
    ])
  })

  // float
  test('float optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('float')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Float?'.replace(/\s+/gu, '\t'),
    ])
  })
  test('float required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('float')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Float'.replace(/\s+/gu, '\t'),
    ])
  })

  // bool
  test('bool optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('bool')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Boolean?'.replace(/\s+/gu, '\t'),
    ])
  })
  test('bool required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('bool')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	Boolean'.replace(/\s+/gu, '\t'),
    ])
  })

  // datetime
  test('datetime optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('datetime')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	DateTime?'.replace(/\s+/gu, '\t'),
    ])
  })
  test('datetime required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('datetime')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	DateTime'.replace(/\s+/gu, '\t'),
    ])
  })

  // date
  test('date optional', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('date')
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	DateTime?	@db.Date'.replace(/\s+/gu, '\t'),
    ])
  })
  test('date required', () => {
    const someField = new ScalarFieldBuilder('someField', 'ru')
      .setType('date')
      .setRequired()
      .build()
    expect(genPrismaScalarField(someField)).toEqual([
      '  someField	DateTime	@db.Date'.replace(/\s+/gu, '\t'),
    ])
  })
})
