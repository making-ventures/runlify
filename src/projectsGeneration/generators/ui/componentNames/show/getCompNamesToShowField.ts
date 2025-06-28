import { Field } from '../../../../builders/buildedTypes'
import { getCompNamesToShowIdField } from './getCompNamesToShowIdField'
import { getCompNamesToShowLinkField } from './getCompNamesToShowLinkField'
import { getCompNamesToShowScalarField } from './getCompNamesToShowScalarField'
import { LinkShowComponentName, ShowComponentName } from '../types'

export const getCompNamesToShowField = (
  field: Field,
): Array<ShowComponentName | LinkShowComponentName> => {
  const { category } = field
  switch (category) {
    case 'link':
      return getCompNamesToShowLinkField()
    case 'scalar':
      return getCompNamesToShowScalarField(field)
    case 'id':
      return getCompNamesToShowIdField(field)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
