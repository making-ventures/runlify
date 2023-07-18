import 'jest-extended';
import { BaseValidation } from './types'

const baseValudationToYupAssertions = (validation: BaseValidation): string[] => {
  const assertions: string[] = [];

  if (validation.required) {
    assertions.push(`required()`)
    // assertions.push(`typeError(t('validation.required'))`)
  }

  return assertions;
}

export default baseValudationToYupAssertions;