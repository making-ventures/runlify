import { IdField } from '../../../../builders/buildedTypes'
import { getCompNameToShowScalar } from './getCompNameToShowScalar'
import { LinkShowComponentName, ShowComponentName } from '../types'

export const getCompNamesToShowIdField = (
  field: IdField
): Array<ShowComponentName | LinkShowComponentName> => {
  return [getCompNameToShowScalar(field)]
}
