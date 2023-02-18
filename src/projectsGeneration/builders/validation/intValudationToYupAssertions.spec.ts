import {it, expect} from 'jest-without-globals';
import 'jest-extended';
import intValudationToYupAssertions from './intValudationToYupAssertions';

// yarn test --testPathPattern intValudationToYupAssertions

describe('intValudationToYupAssertions', () => {
  it('form assertions for required int field', () => {
    expect(
      intValudationToYupAssertions({
        type: 'int',
        required: true,
      })
    ).toIncludeSameMembers([
      'number()',
      `required(t('validation.required'))`,
      `integer(t('validation.onlyIntegers'))`,
      `max(2147483647, t('validation.maxValue', {max: 2147483647}))`,
      `min(-2147483648, t('validation.minValue', {min: -2147483648}))`,
      `typeError(t('validation.required'))`,
    ])
  })
})
