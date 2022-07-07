import { ScalarField } from '../../../../builders/buildedTypes'
import { getCompNameToShowScalar } from './getCompNameToShowScalar'
import { LinkShowComponentName, ShowComponentName } from '../types'

export const getCompNamesToShowScalarField = (
  field: ScalarField
): Array<ShowComponentName | LinkShowComponentName> => {
  return [getCompNameToShowScalar(field.type)]
}
