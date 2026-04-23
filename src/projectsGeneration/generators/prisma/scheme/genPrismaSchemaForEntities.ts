import {Entity} from '../../../builders'
import {LinkedEntities} from '../../../types'
import {genPrismaEntity} from './genPrismaEntity'

export const genPrismaSchemaForEntities = (
  entities: Entity[],
  links: LinkedEntities[],
  forShards = false,
  allEntities?: Map<string, Entity>,
) => {
  const prismaSchemas: string[] = []
  for (const entity of entities) {
    prismaSchemas.push(genPrismaEntity(entity, links, forShards, allEntities))
  }

  return prismaSchemas.join('\n\n')
}
