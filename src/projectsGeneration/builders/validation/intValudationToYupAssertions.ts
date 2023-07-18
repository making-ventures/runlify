import 'jest-extended';
import numberValudationToYupAssertions from './numberValudationToYupAssertions';
import { IntValidation } from './types'

const intValudationToYupAssertions = (validation: IntValidation): string[] => {
  const assertions: string[] = numberValudationToYupAssertions(validation);

  let max: number = validation.max ?? 2147483647;
  let min: number = validation.min ?? -2147483648;

  if (min) {
    assertions.push(`min(${min}, t('validation.minValue', {min: ${min}}))`)
  }

  if (max) {
    assertions.push(`max(${max}, t('validation.maxValue', {max: ${max}}))`)
  }

  assertions.push(`integer()`)

  return assertions;
}


export default intValudationToYupAssertions;