export type BuildPrismaCommandsOptions = {
  databaseNames: string[]
  sharding: boolean
  prismaMajor: number
}

const joinSteps = (steps: string[]): string => steps.join(' && ')

const extraDatabases = (databaseNames: string[]): string[] =>
  databaseNames.filter((d) => d !== 'main')

export const buildPrismaGenCommand = ({
  databaseNames,
  sharding,
  prismaMajor,
}: BuildPrismaCommandsOptions): string => {
  const extras = extraDatabases(databaseNames)

  if (prismaMajor >= 7) {
    const steps = [
      'prisma generate --config prisma/prisma.config.ts',
      ...extras.map(
        (db) => `prisma generate --config prisma/databases/${db}/prisma.config.ts`,
      ),
      'tsx src/init/prisma/writeClientPackageStubs.ts',
    ]
    return joinSteps(steps)
  }

  return joinSteps([
    'prisma generate --schema prisma/schema.prisma',
    ...extras.map(
      (db) => `prisma generate --schema prisma/databases/${db}/schema.prisma`,
    ),
  ])
}

export const buildShardsGenCommand = ({
  sharding,
  prismaMajor,
}: BuildPrismaCommandsOptions): string | null => {
  if (!sharding) {
    return null
  }

  if (prismaMajor >= 7) {
    return joinSteps([
      'prisma generate --config prisma/shards/prisma.config.ts',
      'tsx src/init/prisma/writeClientPackageStubs.ts --shards-only',
    ])
  }

  return 'prisma generate --schema prisma/shards/schema.prisma'
}

export const buildPrismaNewMigrationCommand = ({
  databaseNames,
  prismaMajor,
}: BuildPrismaCommandsOptions): string => {
  const extras = extraDatabases(databaseNames)
  const migratePrefix = 'runlify start env=local prisma migrate dev'

  if (prismaMajor >= 7) {
    return joinSteps([
      `${migratePrefix} --config prisma/prisma.config.ts`,
      ...extras.map(
        (db) => `${migratePrefix} --config prisma/databases/${db}/prisma.config.ts`,
      ),
    ])
  }

  return joinSteps([
    `${migratePrefix} --schema=prisma/schema.prisma --preview-feature`,
    ...extras.map(
      (db) =>
        `${migratePrefix} --schema=prisma/databases/${db}/schema.prisma --preview-feature`,
    ),
  ])
}

export const buildShardsNewMigrationCommand = ({
  sharding,
  prismaMajor,
}: BuildPrismaCommandsOptions): string | null => {
  if (!sharding) {
    return null
  }

  const migratePrefix = 'runlify start env=local prisma migrate dev'

  if (prismaMajor >= 7) {
    return `${migratePrefix} --config prisma/shards/prisma.config.ts`
  }

  return `${migratePrefix} --schema=prisma/shards/schema.prisma --preview-feature`
}

export const buildPrismaDeployCommand = ({
  databaseNames,
  prismaMajor,
}: BuildPrismaCommandsOptions): string => {
  const extras = extraDatabases(databaseNames)
  const deployPrefix = 'runlify start env=local prisma migrate deploy'

  if (prismaMajor >= 7) {
    return joinSteps([
      `${deployPrefix} --config prisma/deploy.prisma.config.ts`,
      ...extras.map(
        (db) => `${deployPrefix} --config prisma/databases/${db}/deploy.prisma.config.ts`,
      ),
    ])
  }

  return joinSteps([
    `${deployPrefix} --schema=prisma/deployConnection.prisma`,
    ...extras.map(
      (db) => `${deployPrefix} --schema=prisma/databases/${db}/deployConnection.prisma`,
    ),
  ])
}

export const buildMigrationsListCommand = ({prismaMajor}: BuildPrismaCommandsOptions): string =>
  prismaMajor >= 7
    ? 'prisma migrate status --config prisma/deploy.prisma.config.ts'
    : 'prisma migrate status --schema prisma/deployConnection.prisma'
