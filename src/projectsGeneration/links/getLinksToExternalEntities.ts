import {Entity} from '../builders/buildedTypes'
import {LinkedEntities} from '../types'

export const getLinksToExternalEntities = (
  entity: Entity,
  links: LinkedEntities[]
): LinkedEntities[] =>
  links.filter((link) => link.entityOwnerName === entity.name)
