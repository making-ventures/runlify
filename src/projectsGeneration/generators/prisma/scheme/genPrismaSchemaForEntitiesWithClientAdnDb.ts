import { ProjectWideGenerationArgs } from '../../../args'
import { genPrismaSchemaForEntities } from './genPrismaSchemaForEntities'

export const genPrismaSchemaForEntitiesWithClientAdnDb = ({
  entities,
  allLinks,
}: ProjectWideGenerationArgs) => {
  const joined = genPrismaSchemaForEntities(entities, allLinks)

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fieldReference", "metrics", "extendedWhereUnique"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_MAIN_WRITE_URI")
}

${joined}`
}
