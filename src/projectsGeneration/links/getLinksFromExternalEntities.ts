import { Entity } from '../builders/buildedTypes'
import { LinkedEntities } from '../types'

export const getLinksFromExternalEntities = (
  entity: Entity,
  links: LinkedEntities[]
): LinkedEntities[] =>
  links.filter((link) => link.externalEntityName === entity.name)
