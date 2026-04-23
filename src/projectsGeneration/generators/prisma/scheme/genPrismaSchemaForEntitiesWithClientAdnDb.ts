import {ProjectWideGenerationArgs} from '../../../args'
import {Entity} from '../../../builders'
import {genPrismaSchemaForEntities} from './genPrismaSchemaForEntities'
import {
  prismaDatasourceMigrationEnvVar,
  prismaDatasourceWriteEnvVar,
} from '../../../utils/databaseMeta'

const collectCrossDatabaseEntityLinkViolations = (
  entities: Entity[],
  allEntities: Map<string, Entity>,
): string[] => {
  const lines: string[] = []
  for (const entity of entities) {
    for (const field of entity.fields) {
      if (field.category !== 'link') {
        continue
      }
      if (field.linkCategory !== 'entity') {
        continue
      }
      const target = allEntities.get(field.externalEntity)
      if (!target) {
        continue
      }
      if (target.database !== entity.database) {
        lines.push(
          `  ${entity.name}.${field.name} → ${field.externalEntity} (database "${entity.database}" → "${target.database}")`,
        )
      }
    }
  }
  return lines
}

export type GenPrismaSchemaDbOptions = {
  /** Logical database key; `main` uses legacy paths and split by sharding. */
  database: string
  /**
   * When `database === 'main'`, same as today: shard vs non-shard models.
   * For `database !== 'main'`, callers must pass `false` (sharding ignored).
   */
  forShards: boolean
}

export const genPrismaSchemaForEntitiesWithClientAdnDb = (
  args: ProjectWideGenerationArgs,
  opts: GenPrismaSchemaDbOptions,
) => {
  const {database, forShards} = opts
  const {entities, allLinks, allEntities} = args

  const effectiveForShards = database === 'main' && forShards

  const ent = entities
    .filter((e) => !e.elasticOnly)
    .filter((e) => {
      if (database !== 'main') {
        return e.database === database
      }
      return e.database === 'main' && (forShards ? e.sharded : !e.sharded)
    })

  const crossDbViolations = collectCrossDatabaseEntityLinkViolations(ent, allEntities)
  if (crossDbViolations.length > 0) {
    throw new Error(
      `Cross-database entity links are not supported (Prisma cannot place @relation across datasources). ` +
        `Replace addLinkField with addViewLinkField for these links in metadata:\n${crossDbViolations.join('\n')}`,
    )
  }

  const joined = genPrismaSchemaForEntities(
    ent,
    allLinks,
    effectiveForShards,
    allEntities,
  )

  const writeEnv = prismaDatasourceWriteEnvVar(database)

  let outputLine = ''
  if (database === 'main' && effectiveForShards) {
    outputLine = `
  output   = "./build"`
  } else if (database !== 'main') {
    outputLine = `
  output   = "./client"`
  }

  return `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["metrics"]${outputLine}
}

datasource db {
  provider = "postgresql"
  url      = env("${writeEnv}")
}

${joined}`
}

/** Minimal deploy schema (migrate URL only). */
export const genDeployConnectionPrisma = (database: string): string => {
  const migrationEnv = prismaDatasourceMigrationEnvVar(database)
  return `datasource db {
  provider = "postgresql"
  url      = env("${migrationEnv}")
}

generator client {
  provider = "prisma-client-js"
}
`
}
