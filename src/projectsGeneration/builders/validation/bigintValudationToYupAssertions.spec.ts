import {it, expect} from 'jest-without-globals';
import 'jest-extended';
import bigintValudationToYupAssertions from './bigintValudationToYupAssertions';

// yarn test --testPathPattern bigintValudationToYupAssertions

describe('bigintValudationToYupAssertions', () => {
  it('form assertions for required bigint field', () => {
    expect(
      bigintValudationToYupAssertions({
        type: 'bigint',
        required: true,
      })
    ).toIncludeSameMembers([
      'number()',
      `required()`,
      `integer(t('validation.onlyIntegers'))`,
    ])
  })
})
