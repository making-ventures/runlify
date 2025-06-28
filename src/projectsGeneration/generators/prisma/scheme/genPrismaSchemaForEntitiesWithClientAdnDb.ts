import {ProjectWideGenerationArgs} from '../../../args'
import {genPrismaSchemaForEntities} from './genPrismaSchemaForEntities'

export const genPrismaSchemaForEntitiesWithClientAdnDb = ({
  entities,
  allLinks,
}: ProjectWideGenerationArgs,
  forShards = false,
) => {
  const ent = entities
    .filter(e => forShards ? e.sharded : !e.sharded)
    .filter(e => !e.elasticOnly);

  const joined = genPrismaSchemaForEntities(ent, allLinks, forShards)

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["metrics"]${forShards ? `
  output   = "./build"`: ''}
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_MAIN_WRITE_URI")
}

${joined}`
}
