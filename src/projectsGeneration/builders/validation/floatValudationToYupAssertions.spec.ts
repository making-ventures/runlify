import {it, expect} from 'jest-without-globals';
import 'jest-extended';
import floatValudationToYupAssertions from './floatValudationToYupAssertions';

// yarn test --testPathPattern floatValudationToYupAssertions

describe('floatValudationToYupAssertions', () => {
  it('form assertions for required float field', () => {
    expect(
      floatValudationToYupAssertions({
        type: 'float',
        required: true,
      })
    ).toIncludeSameMembers([
      'number()',
      `required()`,
    ])
  })
})
