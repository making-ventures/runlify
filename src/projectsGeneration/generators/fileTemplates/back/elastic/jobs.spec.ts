import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import {NumberType} from '../../../../builders/buildedTypes'
import {genJobsDataTmpl} from './jobs'

// yarn test --testPathPattern elastic/jobs

describe('elastic jobs', () => {
  test('bigint scalar field uses longFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('amount').setType('bigint').setRequired()

    expect(genJobsDataTmpl([cards.build()])).toContain('longFields')
    expect(genJobsDataTmpl([cards.build()])).toContain("'amount',")
    expect(genJobsDataTmpl([cards.build()])).not.toContain('integerFields')
  })

  test('money field uses longFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('price').setNumberType(NumberType.Money).setRequired()

    expect(genJobsDataTmpl([cards.build()])).toContain('longFields')
    expect(genJobsDataTmpl([cards.build()])).toContain("'price',")
  })

  test('bigint id field stays keyword', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()

    const result = genJobsDataTmpl([cards.build()])

    expect(result).toContain('keywordFields')
    expect(result).toContain("'id',")
    expect(result).not.toContain('longFields')
  })
})
