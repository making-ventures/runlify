import {
  databaseNameToEnvSuffix,
  postgresUrlDatabaseName,
  prismaDatasourceMigrationEnvVar,
} from '../../../utils/databaseMeta'

export type GenPrismaConfigOptions = {
  schema: string
  database: string
}

export const genPrismaConfig = ({schema, database}: GenPrismaConfigOptions): string => {
  const migrationEnv = prismaDatasourceMigrationEnvVar(database)
  const defaultDb = postgresUrlDatabaseName(database)

  return `import {defineConfig} from 'prisma/config';

export default defineConfig({
  schema: '${schema}',
  datasource: {
    url: process.env['${migrationEnv}'] ?? 'postgresql://postgres:password@localhost:5432/${defaultDb}',
  },
});
`
}

export const genMainPrismaConfig = (): string =>
  genPrismaConfig({schema: 'schema.prisma', database: 'main'})

export const genMainDeployPrismaConfig = (): string =>
  genPrismaConfig({schema: 'deployConnection.prisma', database: 'main'})

export const genExtraDbPrismaConfig = (database: string): string =>
  genPrismaConfig({schema: 'schema.prisma', database})

export const genExtraDbDeployPrismaConfig = (database: string): string =>
  genPrismaConfig({schema: 'deployConnection.prisma', database})

export const genShardsPrismaConfig = (): string =>
  genPrismaConfig({schema: 'schema.prisma', database: 'main'})

export const genShardsDeployPrismaConfig = (): string =>
  genPrismaConfig({schema: 'deployConnection.prisma', database: 'main'})

/** Used in tests to assert env var naming for extra DBs. */
export const extraDbMigrationEnvVar = (database: string): string =>
  `DATABASE_${databaseNameToEnvSuffix(database)}_MIGRATION_URI`
