import { ProjectWideGenerationArgs } from '../../../args'
import { genPrismaSchemaForEntities } from './genPrismaSchemaForEntities'

export const genPrismaSchemaForEntitiesWithClientAdnDb = ({
  entities,
  allLinks,
}: ProjectWideGenerationArgs) => {
  const joined = genPrismaSchemaForEntities(entities, allLinks)

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fieldReference", "metrics"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URI")
}

${joined}`
}
