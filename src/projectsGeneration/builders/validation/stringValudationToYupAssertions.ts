import 'jest-extended';
import baseValudationToYupAssertions from './baseValudationToYupAssertions';
import {StringValidation} from './types'

const stringValudationToYupAssertions = (validation: StringValidation): string[] => {
  const assertions: string[] = [];

  assertions.push(`string()`)

  assertions.push(...baseValudationToYupAssertions(validation))

  return assertions;
}

export default stringValudationToYupAssertions;