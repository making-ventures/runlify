/* eslint-disable max-len */
import { plural } from 'pluralize'
import {
  Entity,
  Field,
  IdField,
  LinkField,
  ScalarField,
} from '../../builders/buildedTypes'
import { getFieldByName, isImageFileRef } from '../../metaUtils'
import { getCompNameToShowScalar } from './componentNames/show/getCompNameToShowScalar'

export const getFieldLabel = (entity: Entity, field: Field) => {
  return `label={translate('${plural(entity.type)}.${entity.name}.fields.${
    field.name
  }')}`
}

export const getScalarShowComponent = (entity: Entity, field: ScalarField) => {
  return `<${getCompNameToShowScalar(field)} source='${
    field.name
  }' ${getFieldLabel(entity, field)}${
    field.type === 'datetime' ? ' showTime' : ''
  } />`
}

export const getIdShowComponent = (entity: Entity, field: IdField) => {
  return `<${getCompNameToShowScalar(field)} source='${
    field.name
  }' ${getFieldLabel(entity, field)} />`
}

export const getLinkShowComponent = (
  entity: Entity,
  allEntities: Map<string, Entity>,
  field: LinkField,
  type?: 'list'
) => {
  const linkedEntity = allEntities.get(field.externalEntity)

  if (!linkedEntity) {
    throw new Error(`There is no '${field.externalEntity}' entity`)
  }

  if (type === 'list' && isImageFileRef(field)) {
    return `<ImageViewField reference='${field.externalEntity}' source='${
      field.name
    }' ${getFieldLabel(entity, field)} />`
  }

  return `<ReferenceField source='${field.name}' ${getFieldLabel(
    entity,
    field
  )} reference='${field.externalEntity}' link='show'>
  <${getCompNameToShowScalar(
    getFieldByName(linkedEntity, linkedEntity.titleField)
  )} source='${getFieldByName(linkedEntity, linkedEntity.titleField).name}' />
</ReferenceField>`
}

export const getShowComponent = (
  entity: Entity,
  allEntities: Map<string, Entity>,
  field: Field,
  type?: 'list'
) => {
  const { category } = field
  switch (category) {
    case 'link':
      return getLinkShowComponent(entity, allEntities, field, type)
    case 'id':
      return getIdShowComponent(entity, field)
    case 'scalar':
      return getScalarShowComponent(entity, field)
    default:
      throw new Error(`Unexpected "${category}" category`)
  }
}
