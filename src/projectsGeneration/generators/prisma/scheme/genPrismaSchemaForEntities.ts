import { Entity } from '../../../builders/buildedTypes'
import { LinkedEntities } from '../../../types'
import { genPrismaEntity } from './genPrismaEntity'

export const genPrismaSchemaForEntities = (
  entities: Entity[],
  links: LinkedEntities[]
) => {
  const prismaSchemas: string[] = []
  for (const entity of entities) {
    prismaSchemas.push(genPrismaEntity(entity, links))
  }

  return prismaSchemas.join('\n\n')
}
