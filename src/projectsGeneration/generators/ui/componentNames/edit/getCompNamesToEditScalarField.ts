import {ScalarField} from '../../../../builders/buildedTypes'
import {getCompNameToEditScalar} from './getCompNameToEditScalar'
import {EditComponentName, LinkEditComponentName} from '../types'

export const getCompNamesToEditScalarField = (
  field: ScalarField
): Array<EditComponentName | LinkEditComponentName> => {
  return [getCompNameToEditScalar(field.type)]
}
