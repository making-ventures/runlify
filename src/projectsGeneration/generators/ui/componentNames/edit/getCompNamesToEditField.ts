import {Entity, Field} from '../../../../builders/buildedTypes'
import {getCompNamesToEditIdField} from './getCompNamesToEditIdField'
import {getCompNamesToEditLinkField} from './getCompNamesToEditLinkField'
import {getCompNamesToEditScalarField} from './getCompNamesToEditScalarField'
import {EditComponentName, LinkEditComponentName} from '../types'

export const getCompNamesToEditField = (
  field: Field,
  allEntities: Map<string, Entity>
): Array<EditComponentName | LinkEditComponentName> => {
  const { category } = field
  switch (category) {
    case 'link':
      return getCompNamesToEditLinkField(field, allEntities)
    case 'scalar':
      return getCompNamesToEditScalarField(field)
    case 'id':
      return getCompNamesToEditIdField(field)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
