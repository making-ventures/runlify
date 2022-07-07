import { Entity, LinkField } from '../../../../builders/buildedTypes'
import { getFieldByName } from '../../../../metaUtils'
import { EditComponentName, LinkEditComponentName } from '../types'

export const getCompNamesToEditLinkField = (
  field: LinkField,
  allEntities: Map<string, Entity>
): Array<EditComponentName | LinkEditComponentName> => {
  const linkedEntity = allEntities.get(field.externalEntity)

  if (!linkedEntity) {
    throw new Error(`There is no '${field.externalEntity}' entity`)
  }

  return getFieldByName(linkedEntity, linkedEntity.titleField).type === 'string'
    ? ['ReferenceInput', 'AutocompleteInput']
    : ['ReferenceInput', 'SelectInput']
}
