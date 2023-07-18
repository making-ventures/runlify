import 'jest-extended';
import baseValudationToYupAssertions from './baseValudationToYupAssertions';
import { NumberValidation } from './types'

const numberValudationToYupAssertions = (validation: NumberValidation): string[] => {
  const assertions: string[] = [];

  assertions.push(`number()`)

  assertions.push(...baseValudationToYupAssertions(validation))

  // .number()
  // .required()
  // .integer()
  // .max(2147483647, t('validation.maxValue', {max: 2147483647}))
  // .typeError(t('validation.required')),

  // max?: number;
  // min?: number;

  // positive?: boolean;
  // negative?: boolean;

  // notPositive?: boolean;
  // notNegative?: boolean;

  if (validation.positive) {
    assertions.push(`positive(0, t('validation.positive'))`)
  }

  if (validation.negative) {
    assertions.push(`negative(0, t('validation.negative'))`)
  }

  if (validation.notPositive) {
    assertions.push(`max(0, t('validation.maxValue', {max: 0}))`)
  }

  if (validation.notNegative) {
    assertions.push(`min(0, t('validation.minValue', {min: 0}))`)
  }

  return assertions;
}

export default numberValudationToYupAssertions;