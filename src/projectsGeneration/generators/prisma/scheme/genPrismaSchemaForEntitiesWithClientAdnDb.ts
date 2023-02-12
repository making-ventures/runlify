import { ProjectWideGenerationArgs } from '../../../args'
import { genPrismaSchemaForEntities } from './genPrismaSchemaForEntities'

export const genPrismaSchemaForEntitiesWithClientAdnDb = ({
  entities,
  allLinks,
}: ProjectWideGenerationArgs,
  forShards = false,
) => {
  let ent = entities.filter(e => forShards ? e.shardUniqKeys : !e.shardUniqKeys);

  const joined = genPrismaSchemaForEntities(ent, allLinks, forShards)

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fieldReference", "metrics", "extendedWhereUnique"]${forShards ? `
  output   = "./build"`: ''}
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_MAIN_WRITE_URI")
}

${joined}`
}
