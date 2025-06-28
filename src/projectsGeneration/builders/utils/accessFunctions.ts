import {Entity, Field} from '../buildedTypes'

export const getEntityField = (entity: Entity, fieldName: string): Field => {
  const field = entity.fields.find((f) => f.name === fieldName)
  if (!field) {
    throw new Error(`There is no field with "${fieldName}" name`)
  }

  return field
}
