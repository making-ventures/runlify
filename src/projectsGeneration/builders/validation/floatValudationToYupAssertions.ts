import 'jest-extended';
import numberValudationToYupAssertions from './numberValudationToYupAssertions';
import { FloatValidation } from './types'

const floatValudationToYupAssertions = (validation: FloatValidation): string[] => {
  const assertions: string[] = numberValudationToYupAssertions(validation);

  return assertions;
}

export default floatValudationToYupAssertions;