import {Entity} from '../builders/buildedTypes'
import {LinkedEntities} from '../types'
import {getLinkFields} from '../metaUtils'

export const getLinksOfEntities = (entities: Entity[]): LinkedEntities[] => {
  const allLinks: LinkedEntities[] = []

  for (const entity of entities) {
    for (const field of getLinkFields(entity)) {
      allLinks.push({
        externalEntityName: field.externalEntity,
        fromField: field,
        entityOwnerName: entity.name,
        type: 'oneToMany',
      })
    }
  }

  return allLinks
}
