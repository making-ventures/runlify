import {expect} from 'jest-without-globals'
import {defaultBootstrapEntityOptions} from '../../../../../../types'
import {uiDataProviderTmpl} from './index'

// yarn test --testPathPattern dataProvider

describe('uiDataProviderTmpl', () => {
  test('imports the local generated schema by default', () => {
    expect(uiDataProviderTmpl([])).toContain("await import('../generated/graphql.schema.json')")
  })

  test('uses uiGraphqlSchemaImport when set', () => {
    const out = uiDataProviderTmpl([], {
      ...defaultBootstrapEntityOptions,
      uiGraphqlSchemaImport: '@rlw/shared/graphql.schema.json',
    })
    expect(out).toContain("await import('@rlw/shared/graphql.schema.json')")
    expect(out).not.toContain('../generated/graphql.schema.json')
  })

  test('falls back to the default when the option is empty', () => {
    const out = uiDataProviderTmpl([], {...defaultBootstrapEntityOptions, uiGraphqlSchemaImport: ''})
    expect(out).toContain("await import('../generated/graphql.schema.json')")
  })
})
