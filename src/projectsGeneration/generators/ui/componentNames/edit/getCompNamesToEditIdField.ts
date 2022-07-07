import { IdField } from '../../../../builders/buildedTypes'
import { getCompNameToEditScalar } from './getCompNameToEditScalar'
import { EditComponentName, LinkEditComponentName } from '../types'

export const getCompNamesToEditIdField = (
  field: IdField
): Array<EditComponentName | LinkEditComponentName> => {
  return [getCompNameToEditScalar(field.type)]
}
