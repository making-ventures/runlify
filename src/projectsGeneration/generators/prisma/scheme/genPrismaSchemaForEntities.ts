import {Entity} from '../../../builders'
import {LinkedEntities} from '../../../types'
import {genPrismaEntity} from './genPrismaEntity'

export const genPrismaSchemaForEntities = (
  entities: Entity[],
  links: LinkedEntities[],
  forShards = false,
) => {
  const prismaSchemas: string[] = []
  for (const entity of entities) {
    prismaSchemas.push(genPrismaEntity(entity, links, forShards))
  }

  return prismaSchemas.join('\n\n')
}
