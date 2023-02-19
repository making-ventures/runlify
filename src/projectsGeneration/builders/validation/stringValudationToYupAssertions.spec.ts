import {it, expect} from 'jest-without-globals';
import 'jest-extended';
import stringValudationToYupAssertions from './stringValudationToYupAssertions';

// yarn test --testPathPattern stringValudationToYupAssertions

describe('stringValudationToYupAssertions', () => {
  it('form assertions for required string field', () => {
    expect(
      stringValudationToYupAssertions({
        type: 'string',
        required: true,
      })
    ).toIncludeSameMembers([
      'string()',
      `required()`,
    ])
  })
})
