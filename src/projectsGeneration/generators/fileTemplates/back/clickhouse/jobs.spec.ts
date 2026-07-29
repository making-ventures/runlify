import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import {NumberType} from '../../../../builders/buildedTypes'
import {genClickHouseJobsDataTmpl} from './jobs'

// yarn test --testPathPattern clickhouse/jobs

describe('clickhouse jobs', () => {
  test('bigint scalar field uses longFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('amount').setType('bigint').setRequired()

    expect(genClickHouseJobsDataTmpl([cards.build()])).toContain('longFields')
    expect(genClickHouseJobsDataTmpl([cards.build()])).toContain("'amount',")
    expect(genClickHouseJobsDataTmpl([cards.build()])).not.toContain('integerFields')
  })

  test('money field uses longFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('price').setNumberType(NumberType.Money).setRequired()

    expect(genClickHouseJobsDataTmpl([cards.build()])).toContain('longFields')
    expect(genClickHouseJobsDataTmpl([cards.build()])).toContain("'price',")
  })

  test('bigint id field stays keyword', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('keywordFields')
    expect(result).toContain("'id',")
    expect(result).not.toContain('longFields')
  })
})
