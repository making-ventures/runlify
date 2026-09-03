import {expect} from 'jest-without-globals'
import CatalogBuilder from '../../../../builders/CatalogBuilder'
import {NumberType} from '../../../../builders/buildedTypes'
import {genClickHouseJobsDataTmpl} from './jobs'

// yarn test --testPathPattern clickhouse/jobs

describe('clickhouse jobs', () => {
  test('bigint scalar field uses longFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    // CatalogBuilder defaults the id field to 'int' — pin it to 'string' so the default id
    // field's own (correctly bucketed) integerFields doesn't false-positive this assertion
    // about the unrelated 'amount' field.
    cards.getKey().setType('string')
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

  test('string id field stays keyword', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('string')
    cards.addField('name').setType('string').setRequired()

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('keywordFields')
    expect(result).toContain("'id',")
  })

  // Forcing id/link fields to 'keyword' regardless of their real underlying type (as
  // elastic/jobs.ts safely does — ES coerces numbers into keyword fields) made the ClickHouse
  // Kafka Connect sink fail with "cannot convert Kafka value of type INT64 ... to ClickHouse
  // type STRING": the real Kafka Connect value for a bigint id/link is INT64, not a string, and
  // the sink requires an exact type match. Found empirically cutting bsProfiles over
  // (countryId, an Int-keyed link field) — a bigint-keyed id has the identical failure mode.
  test('bigint id field uses longFields, not keywordFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.getKey().setType('bigint')
    cards.addField('name').setType('string').setRequired()

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('longFields')
    expect(result).toContain("'id',")
  })

  test('int-keyed link field uses integerFields, not keywordFields', () => {
    const countries = new CatalogBuilder('countries', 'ru')
    countries.getKey().setType('int')
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addLinkField(countries, 'countryId').setRequired()

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('integerFields')
    expect(result).toContain("'countryId',")
    expect(result).not.toContain('keywordFields')
  })

  // ClickHouse (unlike Elasticsearch) errors on writing NULL into a non-Nullable column — found
  // cutting a real entity over to CDC-only ClickHouse storage, where a required-looking bucket
  // (e.g. keywordFields for a link field) silently assumed every row always has a value.
  test('non-required string field uses nullableTextFields, not textFields', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('nickname').setType('string')

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('nullableTextFields')
    expect(result).toContain("'nickname',")
    expect(result).not.toContain('textFields([\n      \'nickname\',')
  })

  test('non-required int-keyed link field uses nullableIntegerFields, not integerFields', () => {
    const countries = new CatalogBuilder('countries', 'ru')
    countries.getKey().setType('int')
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addLinkField(countries, 'countryId')

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('nullableIntegerFields')
    expect(result).toContain("'countryId',")
  })

  test('non-required int/bool/date/bigint fields use their nullable variants', () => {
    const cards = new CatalogBuilder('cards', 'ru')
    cards.addField('score').setType('int')
    cards.addField('active').setType('bool')
    cards.addField('issuedAt').setType('date')
    cards.addField('amount').setType('bigint')

    const result = genClickHouseJobsDataTmpl([cards.build()])

    expect(result).toContain('nullableIntegerFields')
    expect(result).toContain('nullableBooleanFields')
    expect(result).toContain('nullableDateFields')
    expect(result).toContain('nullableLongFields')
  })
})
