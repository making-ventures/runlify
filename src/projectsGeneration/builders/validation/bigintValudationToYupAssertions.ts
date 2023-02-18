import 'jest-extended';
import numberValudationToYupAssertions from './numberValudationToYupAssertions';
import { BigIntValidation } from './types'

const bigintValudationToYupAssertions = (validation: BigIntValidation): string[] => {
  const assertions: string[] = numberValudationToYupAssertions(validation);

  assertions.push(`integer(t('validation.onlyIntegers'))`)

  return assertions;
}

export default bigintValudationToYupAssertions;